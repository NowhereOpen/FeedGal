import { SessionRequestHandlerBase } from "~/src/server/gyst-server/express-server-endpoint-collection/endpoint-base/session"
import { setRedirectUrl } from "~/src/server/gyst-server/common/session"
import { cred_module_collection } from "~/src/server/cred-module-collection"

import { MUST_BE_LOGGED_IN } from "~/src/common/warning-error"

export class RedirectConnectNewAccountRequestHandler extends SessionRequestHandlerBase {
  oauth_service_id!:string
  
  storeParams():void {
    this.oauth_service_id = this.req.params.oauth_service_id
  }

  async doTasks():Promise<void> {
    if(this.is_logged_in == false) {
      return this.sendError(400, MUST_BE_LOGGED_IN("You cannot connect a new account when not logged in."))
    }

    /**
     * 20202-06-15 16:00 
     * 
     * This end poin can be reached from `/suite` and `/settings/accounts`. Store the url
     * so that at the end of the oauth process, it can be redirected back to these url.
     */
    setRedirectUrl(<any> this.req, this.req.headers.referer)

    const url = await cred_module_collection[this.oauth_service_id].getAuthUrl()

    return this.res.redirect(url)
  }
}