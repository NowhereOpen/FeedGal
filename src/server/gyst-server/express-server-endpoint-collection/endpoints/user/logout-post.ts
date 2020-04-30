import { SessionRequestHandlerBase } from "~/src/server/gyst-server/express-server-endpoint-collection/endpoint-base/session"

export class GetLogoutRequestHandler extends SessionRequestHandlerBase {
  storeParams():void {}

  doTasks():void {
    this.logout()
  }

  getResponse():any {
    return { success: true }
  }
}