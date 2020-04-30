import { SessionRequestHandlerBase } from "~/src/server/gyst-server/express-server-endpoint-collection/endpoint-base/session"

import { oauth_connected_user_storage } from "~/src/server/model-collection/models/oauth-connected-user"
import { gyst_user_storage } from "~/src/server/model-collection/models/user"
import { oauth_access_token_storage } from "~/src/server/model-collection/models/oauth-access-token"

export class DeleteUserRequestHandler extends SessionRequestHandlerBase {
  storeParams():void|Promise<void> {}

  doTasks():void|Promise<void> {

  }

  // getResponse():any|Promise<any> {}
}