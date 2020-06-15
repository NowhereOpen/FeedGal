import { SessionRequestHandlerBase } from "~/src/server/gyst-server/express-server-endpoint-collection/endpoint-base/session"
import { cred_module_collection } from "~/src/server/cred-module-collection"

export class RedirectLoginRequestHandler extends SessionRequestHandlerBase {
  oauth_service_id!:string
  
  storeParams():void {
    this.oauth_service_id = this.req.params.oauth_service_id
  }

  /**
   * 2020-06-15 16:19 
   * 
   * Note that signup and login both don't need `setRedirectUrl` because signup
   * process NAVIGATIONS are done with client `$router.push` and the login
   * REDIRECTION is just to the main page.
   */
  async doTasks():Promise<void> {
    if(this.is_logged_in) {
      return this.sendError(
        400,
        "MUST_BE_ANON_USER",
        "You must not be logged in to signup or login with OAuth.",
        { oauth_service_id: this.oauth_service_id }
      )
    }

    const url = await cred_module_collection[this.oauth_service_id].getAuthUrl()
    return this.res.redirect(url)
  }
}