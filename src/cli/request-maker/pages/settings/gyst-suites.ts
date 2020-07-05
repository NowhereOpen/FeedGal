import axios from "axios"
import { UrlsGystResource } from "~/src/common/urls"

/**
 * ============================================
 * ServiceSetting
 * ============================================
 */

export async function addNewServiceSetting(service_id:string, oauth_connected_user_id:string|undefined) {
  return axios.post(UrlsGystResource.addNewServiceSetting(), { service_id, oauth_connected_user_id })
}

export async function deleteServiceSetting(service_setting_id:string) {
  return axios.delete(UrlsGystResource.deleteServiceSetting(service_setting_id))
}

export async function getGoogleCalendars(service_setting_id:string) {
  return axios.get(UrlsGystResource.getGoogleCalendars(service_setting_id))
}

/**
 * ============================================
 * SettingValue
 * ============================================
 */

export async function addNewSettingValue(service_setting_id:string, setting_value:any) {
  return axios.post(UrlsGystResource.addNewSettingValue(), { service_setting_id, setting_value })
}

export async function updateSettingValue(setting_value_id:string, setting_value:any) {
  return axios.patch(UrlsGystResource.updateSettingValue(setting_value_id), { setting_value })
}

export async function deleteSettingValue(setting_value_id:string) {
  return axios.delete(UrlsGystResource.deleteSettingValue(setting_value_id))
}