import { SessionRequestHandlerBase } from "~/src/server/gyst-server/express-server-endpoint-collection/endpoint-base/session"

import { oauth_collection } from "~/src/server/cred-module-collection"

export class RedirectConnectNewAccoutnRequestHandler extends SessionRequestHandlerBase {
  oauth_service_id!:string
  
  storeParams():void {
    this.oauth_service_id = this.req.params.oauth_service_id
  }

  async doTasks():Promise<void> {
    if(this.is_logged_in == false) {
      return this.sendError(400, "MUST_BE_LOGGED_IN", "You cannot connect a new account when not logged in.")
    }

    const url = await oauth_collection[this.oauth_service_id].getAuthUrl()
    return this.res.redirect(url)
  }
}