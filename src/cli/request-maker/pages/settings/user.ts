import axios from "axios"
import { UrlsGystResource } from "~/src/common/urls"

export async function disconnectService(oauth_connected_user_entry_id:string) {
  return await axios.get(UrlsGystResource.disconnectService(oauth_connected_user_entry_id))
}

export async function revokeRemoveConfirm(oauth_user_entry_id:string) {
  const url = UrlsGystResource.disconnectService(oauth_user_entry_id)
  return await axios.post(url)
}

export async function removeAccountConfirm() {
  const url = UrlsGystResource.deleteUser()
  return await axios.delete(url)
}