import axios from "axios"
import { UrlsGystResource } from "~/src/common/urls"

export function updatePrivacySettings(new_privacy_settings:any) {
  return axios.patch(UrlsGystResource.updatePrivacySettings(), { new_privacy_settings })
}

export function updateFriendlyName(new_friendly_name:string) {
  return axios.patch(UrlsGystResource.updateFriendlyName(), { new_friendly_name })
}

export async function disconnectService(oauth_connected_user_entry_id:string) {
  return await axios.get(UrlsGystResource.disconnectService(oauth_connected_user_entry_id))
}