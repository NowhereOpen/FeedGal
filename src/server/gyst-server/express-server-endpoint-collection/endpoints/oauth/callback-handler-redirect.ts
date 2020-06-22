import urlJoin from "url-join"

import { SessionRequestHandlerBase } from "~/src/server/gyst-server/express-server-endpoint-collection/endpoint-base/session"

import { UrlsGystResource } from "~/src/common/urls"

import { UserInfo, popRedirectUrl } from "~/src/server/gyst-server/common/session"
import { cred_module_collection } from "~/src/server/cred-module-collection"

import { OAuthBaseClass } from "oauth-module-suite"
import { isOAuth1CallbackUrlValid, isOAuth2CallbackUrlValid } from "oauth-module-suite"

import { oauth_connected_user_storage } from "~/src/server/model-collection/models/oauth-connected-user"
import { gyst_user_storage } from "~/src/server/model-collection/models/user"
import { oauth_access_token_storage } from "~/src/server/model-collection/models/oauth-access-token"

function log(...args:any[]) {
  console.log(`[redirect-handle-oauth-callback]`, ...args)
}

/**
 * 2020-03-08 14:41
 * 
 * It feels like trying to refactor this code just makes it more complex than it should be, so everything
 * is implemented here. My comment is that there wasn't anything that was used repeatedly that it requires
 * refactoring.
 * 
 * For example, getting token response and user info was done 'commonly' for all four cases, but it could've
 * been done in THIS code then pass the retrieved data later when needed.
 */
export class RedirectHandleOAuthCallbackRequestHandler extends SessionRequestHandlerBase {
  service_id!:string
  origin!:string
  /**
   * Not href. Href includes query parameters as well.
   * 
   * Used for checking if the url that third party service sent the user back to our server means that
   * user succeeded in authenticataion or not.
   */
  full_url!:string

  oauth_mod!:OAuthBaseClass

  token_response!:any
  user_info!:UserInfo
  
  is_connect_service!:boolean

  storeParams():void {
    this.service_id = this.req.params.service_id
    this.origin = this.req.protocol + '://' + this.req.get('host')
    this.full_url = this.origin + this.req.originalUrl

    this.oauth_mod = cred_module_collection[this.service_id]
  }

  validateUrl() {
    let validator:any = {
      "oauth1": (url:string) => isOAuth1CallbackUrlValid(url),
      "oauth2": (url:string) => isOAuth2CallbackUrlValid(url)
    }
  
    if(! validator[this.oauth_mod.oauth_type](this.full_url)) {
      const e = new Error("Invalid callback url. Was callback url generated properly?")
      Object.assign(e, {
        name: "INVALID_CALLBACK_URL", error: "INVALID_CALLBACK_URL",
        used_redirect_url: this.full_url
      })
      throw e
    }
  }

  async loadUserInfo() {
    const user_info_result = await this.oauth_mod.getUserInfo(this.token_response)
    const _user_info:UserInfo = this.oauth_mod.resDataToUserInfo(user_info_result)
    const attached = {
      service_id: this.service_id,
      user_info_result
    }
    this.user_info = Object.assign(_user_info, attached)
  }

  async doTasks():Promise<void> {
    let redirect_url = ""

    this.validateUrl()

    this.token_response = await this.oauth_mod.getTokenResponse(this.full_url)
    
    await this.loadUserInfo()

    /**
     * Four cases for two big cases.
     * 
     * Two big cases: (1) User is logged in, (2) not logged in.
     * 
     * When a user is logged in it means that the user is attempting to connect a new account. This results
     * in two sub cases: (1-a) The account is already connected, (1-b) Successfully the connect new account.
     * 
     * When a user is not logged it, it means user is (2-a) trying to log in, (2-b) trying to sign up.
     */
    if(this.is_logged_in) {
      log(`user_id (${this.user_id}) is attempting to connect another oauth (${this.service_id}) account`)

      const is_already_connected = await oauth_connected_user_storage.isServiceAccountAlreadyConnected(
        this.user_id!,
        this.service_id,
        this.user_info.user_uid
      )

      const is_error = await oauth_connected_user_storage!.isErrorWithUserUid(this.service_id, this.user_info.user_uid)

      if(is_already_connected && is_error == false) {
        log(`The triplet (${this.user_id}, ${this.service_id}, ${this.user_info.user_uid}) already exists`)
        const msg = `You have already connected to the service "${this.service_id}" with this account. ` +
          `If you are trying to login, this means that you are already connected`

        this.res.send(msg)
        /**
         * 2020-03-25 21:22
         * 
         * `this.res.send` returns a `Response` type. So return nothing instead.
         */
        return
      }
      else {
        let oauth_connected_user_entry_id:string
        if(is_error == false) {
          // Connect the new service
          oauth_connected_user_entry_id = await oauth_connected_user_storage.connect(
            this.user_id!,
            this.service_id,
            this.user_info,
            this.user_info.json_content
          )
        }
        else {
          /**
           * 2020-03-22 19:00
           * 
           * Fix an account that had problem with access token. The access token is
           * fixed as well as it's updated with the new access token.
           */
          log(`Fixing access token error for oauth_connected_user with service_id (${this.service_id}), service_user_uid (${this.user_info.user_uid}).`)
          const entry = await oauth_connected_user_storage.getEntryWithUserUid(this.service_id, this.user_info.user_uid)
          oauth_connected_user_entry_id = entry!._id
          await oauth_connected_user_storage.setError(oauth_connected_user_entry_id, false)
        }

        await oauth_access_token_storage.storeTokenData(this.service_id, oauth_connected_user_entry_id, this.token_response)

        redirect_url = popRedirectUrl(<any> this.req)
        log(`Connecting account successful. Redirecting to '${redirect_url}'`)

        // // Connect service
        // redirect_url = await new LoggedInOAuthCallbackTask(this.req).getRedirectUrl()
      }
    }
    else {
      log(`A user with session (${this.req.sessionID}) is trying to signup or login`)

      const is_login = await isLogin(this.service_id, this.user_info.user_uid)

      if(is_login) {
        // Store stuff
        log(`A user with session (${this.req.sessionID}) is logging in with service '${this.service_id}'`)

        const oauth_connected_user_entry = await oauth_connected_user_storage!.getSignupEntry(this.service_id, this.user_info.user_uid)
        const oauth_connected_user_entry_id = oauth_connected_user_entry!._id
        
        await oauth_access_token_storage!.storeTokenData(this.service_id, oauth_connected_user_entry_id, this.token_response)

        const user_id = oauth_connected_user_entry!.get("user_id")

        log(`A user with user_id ('${user_id}') is logging in with service '${this.service_id}'`)
        this.loginUser(user_id)
        
        redirect_url = UrlsGystResource.mainPage()
      }
      else {
        /**
         * No storing done here. It's done in the `/oauth/signup` request handling.
         */
        log(`A user with session (${this.req.sessionID}) is signing up with service '${this.service_id}'`)
        this.clearDataForSignup()
        this.storeDataForSignup(this.service_id, this.user_info, this.token_response)

        const path = UrlsGystResource.oauthSignupPage()
        redirect_url = makeCallbackUrl(urlJoin(this.origin, path), this.user_info, this.service_id)
      }

      // Signup or login
      // redirect_url = await new UnauthenticatedOAuthCallbackTask(this.req).getRedirectUrl()
    }

    return this.res.redirect(redirect_url)
  }
}

/**
 * ================================================================
 * Utility functions that should help code more readable.
 * ================================================================
 */

async function isLogin(service_id:string, user_uid:string) {
  const entry = await oauth_connected_user_storage!.getSignupEntry(service_id, user_uid)
  console.log(`isLogin output:`)
  console.log(entry)
  return entry != undefined
}

/**
 * The built url should be signup page, and the search parameters will be used by the frontend
 * to fill out the forms for the user for easier usage.
 */
function makeCallbackUrl(base_url:string, detail:UserInfo, service_id:string):string {
  const { friendly_name, user_id } = detail
  const _callback_url = new URL(base_url)

  if(friendly_name != undefined) {
    _callback_url.searchParams.append("friendly_name", friendly_name)
  }
  if(user_id != undefined) {
    _callback_url.searchParams.append("user_id", user_id)
  }
  _callback_url.searchParams.append("service_id", service_id)

  const callback_url = _callback_url.href
  return callback_url
}