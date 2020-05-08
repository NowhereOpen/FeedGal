import axios from "axios"
import { UrlsGystResource } from "~/src/common/urls"

export async function createNewGystSuite(new_gyst_suite_name:string) {
  return axios.post(UrlsGystResource.createNewGystSuite(), { new_gyst_suite_name })
}

export async function updateGystSuiteName(gyst_suite_id:string, new_gyst_suite_name:string) {
  return axios.patch(UrlsGystResource.updateGystSuite(gyst_suite_id), { new_gyst_suite_name })
}

export async function setAsDefault(gyst_suite_id:string) {
  return axios.patch(UrlsGystResource.setAsDefaultGystSuite(gyst_suite_id))
}

export async function setAsPublic(gyst_suite_id:string, new_value:boolean) {
  return axios.patch(UrlsGystResource.setAsPublicGystSuite(gyst_suite_id), { new_value })
}

export async function deleteGystSuite(gyst_suite_id:string) {
  return axios.delete(UrlsGystResource.deleteGystSuite(gyst_suite_id))
}

/**
 * ============================================
 * ServiceSetting
 * ============================================
 */

export async function addNewServiceSetting(gyst_suite_id:string, service_id:string, oauth_connected_user_id:string, alias:string|undefined) {
  return axios.post(UrlsGystResource.addNewServiceSetting(), { gyst_suite_id, service_id, oauth_connected_user_id, alias })
}

export async function getGystSuiteServiceSettings(gyst_suite_id:string) {
  return axios.get(UrlsGystResource.getGystSuiteServiceSettings(gyst_suite_id))
}

export async function updateServiceSettingOAuthAccount(gyst_suite_id:string, service_setting_id:string, new_oauth_connected_user_id:string) {
  return axios.patch(UrlsGystResource.updateServiceSettingOAuthAccount(service_setting_id), { gyst_suite_id, new_oauth_connected_user_id })
}

export async function toggleService(service_setting_id:string) {
  return axios.get(UrlsGystResource.toggleService(service_setting_id))
}

export async function deleteServiceSetting(service_setting_id:string) {
  return axios.delete(UrlsGystResource.deleteServiceSetting(service_setting_id))
}

/**
 * ============================================
 * SettingValue
 * ============================================
 */

export async function addNewSettingValue(service_setting_id:string, setting_value:any) {
  return axios.post(UrlsGystResource.addNewSettingValue(), { service_setting_id, setting_value })
}

export async function updateSettingValue(service_setting_id:string, setting_value_id:string, setting_value:any) {
  return axios.patch(UrlsGystResource.updateSettingValue(setting_value_id), { service_setting_id, setting_value })
}

export async function deleteSettingValue(setting_value_id:string) {
  return axios.delete(UrlsGystResource.deleteSettingValue(setting_value_id))
}