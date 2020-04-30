import { SessionRequestHandlerBase } from "~/src/server/gyst-server/express-server-endpoint-collection/endpoint-base/session"

export class PostCancelSignupWithOAuthRequestHandler extends SessionRequestHandlerBase {
  storeParams():void|Promise<void> {}

  doTasks():void|Promise<void> {
    this.clearDataForSignup()
    console.log(`[cancel-signup] Cancel successful`)
  }

  getResponse():any|Promise<any> {
    return { success: true }
  }
}