import * as gystSession from "~/src/server/gyst-server/common/session"
import { gyst_user_storage } from "~/src/server/model-collection/models/user"

export async function getUserInfo(req:any) {
  const user_id = gystSession.getLoggedInUserId(<any>req)
  const result = await gyst_user_storage.getUserInfo(user_id)
  return result
}