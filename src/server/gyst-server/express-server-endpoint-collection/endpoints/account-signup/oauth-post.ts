import { SessionRequestHandlerBase } from "~/src/server/gyst-server/express-server-endpoint-collection/endpoint-base/session"

import { MUST_BE_ANON_USER, BAD_SIGNUP_FORM } from "~/src/common/warning-error"

// Models
import { service_setting_storage } from "~/src/server/model-collection/models/service-setting"
import { oauth_connected_user_storage } from "~/src/server/model-collection/models/oauth-connected-user"
import { gyst_user_storage } from "~/src/server/model-collection/models/user"
import { oauth_access_token_storage } from "~/src/server/model-collection/models/oauth-access-token"

// Types
import { SignupForm } from "~/src/common/types/pages/signup-oauth"
import { UserInfo } from "~/src/server/gyst-server/common/session"

export class PostCreateNewAccountRequestHandler extends SessionRequestHandlerBase {
  // Signup form from `signup/oauth` page
  signup_form!:SignupForm
  token_data!:any
  authenticated_user_info!:UserInfo
  oauth_service_id!:string

  oauth_connected_user_entry_id!:string

  async storeParams():Promise<void> {
    this.signup_form = this.req.body.signup_form

    const { service_id, token_data, user_info } = this.getDataForSignup()

    this.token_data = token_data
    this.authenticated_user_info = user_info
    this.oauth_service_id = service_id
  }

  async doTasks():Promise<void> {
    if(this.isLoggedIn()) {
      this.sendError(403, MUST_BE_ANON_USER("You cannot sign up for a new account while logged in."))
      return
    }

    if(this.signup_form.friendly_name.trim() == "") {
      this.sendError(400, BAD_SIGNUP_FORM("Friendly name must not be empty."))
    }

    // Must have "friendly_name"
    this.user_id = await gyst_user_storage.createNewGystUser(this.signup_form)

    this.oauth_connected_user_entry_id = await oauth_connected_user_storage!.connectAsSignup(
      this.user_id,
      this.oauth_service_id,
      this.authenticated_user_info,
      this.authenticated_user_info.json_content
    )
  
    await oauth_access_token_storage!.storeTokenData(this.oauth_service_id, this.oauth_connected_user_entry_id, this.token_data)

    await this.addServices()
  
    // gystSession.loginUser(req, user_id)
    
    this.clearDataForSignup()
  
    console.log(`[create-new-account] Successfully created a new account with:`)
    console.log(`(user id='${this.user_id}', oauth service='${this.oauth_service_id}')`)
    console.log(this.authenticated_user_info)
    console.log(`[create-new-account] End of log`)
  }

  async getResponse():Promise<any> {
    return { user_id: this.user_id }
  }

  async addServices() {
    if(["bitbucket", "facebook"].includes(this.oauth_service_id)) {
      return
    }

    if(this.oauth_service_id == "google") {
      await service_setting_storage.createNewServiceSetting(this.user_id!, "youtube", this.oauth_connected_user_entry_id)
      await service_setting_storage.createNewServiceSetting(this.user_id!, "google-calendar", this.oauth_connected_user_entry_id)
    }
    else {
      await service_setting_storage.createNewServiceSetting(this.user_id!, this.oauth_service_id, this.oauth_connected_user_entry_id)
    }
  }
}