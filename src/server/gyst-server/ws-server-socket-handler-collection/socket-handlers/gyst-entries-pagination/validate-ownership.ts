import { oauth_connected_user_storage } from "~/src/server/model-collection/models/oauth-connected-user"

export async function validateOwnership(user_id:string, oauth_connectetd_user_entry_ids:string[]) {
  if(oauth_connectetd_user_entry_ids.length == 0) return true

  /**
   * 2020-05-05 10:10
   * 
   * May need to check the ownership of `this.user_id` and the `oauth_connected_user_entry_id`
   * in the `services_pagination_req_data`. The client could definitely make a request after
   * modifying the `oauth_connected_user_entry_id` in the `services_pagination_req_data` even
   * when the owner of the entry_id is not logged in.
   */

  const ownerships = await Promise.all(
    oauth_connectetd_user_entry_ids.map(async oauth_connected_user_entry_id => {
      if(oauth_connected_user_entry_id) {
        return _validateOwnership(user_id!, oauth_connected_user_entry_id)
      }
      return true
    })
  )

  return ownerships.every(entry => entry == true)
}
    
async function _validateOwnership(target_user_id:string, oauth_connected_user_entry_id:string):Promise<boolean> {
  const entry = await oauth_connected_user_storage.getEntry(oauth_connected_user_entry_id)
  const user_id = entry!.get("user_id")

  return user_id == target_user_id
}