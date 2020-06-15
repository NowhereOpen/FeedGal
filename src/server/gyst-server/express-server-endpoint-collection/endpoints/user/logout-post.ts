import { SessionRequestHandlerBase } from "~/src/server/gyst-server/express-server-endpoint-collection/endpoint-base/session"
import { UrlsGystResource } from "~/src/common/urls"

export class GetLogoutRequestHandler extends SessionRequestHandlerBase {
  storeParams():void {}

  doTasks():void {
    this.logout()
    return this.res.redirect(UrlsGystResource.loginPage())
  }

  // getResponse():any {
  //   return { success: true }
  // }
}