import axios from "axios"
import { UrlsGystResource } from "~/src/common/urls"

export async function disconnectService(oauth_connected_user_entry_id:string) {
  return await axios.get(UrlsGystResource.disconnectService(oauth_connected_user_entry_id))
}