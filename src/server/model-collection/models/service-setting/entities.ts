import { DeleteUser, DeleteResult } from "~/src/server/model-collection/model-base"

export interface IServiceSetting extends DeleteUser {
  // Create
  createNewServiceSetting(user_id:string, service_id:string, oauth_connected_user_entry_id:string):Promise<any>

  // Read (2)
  getEntry(service_setting_id:string):Promise<any>
  getAllServiceSettingsForUserId(user_id:string):Promise<any[]>
  getEnabledServiceSettingsForUserId(user_id:string):Promise<any[]>
  getTotalServiceSettingsForUserId(user_id:string):Promise<number>
  getServiceId(service_setting_id:string):Promise<any>
  getOAuthConnectedUserEntryId(service_setting_id:string):Promise<any>

  // Update (2)
  updateServiceSetting(service_setting_id:string, service_id:string):Promise<any>
  updateOAuthConnectedUser(service_setting_id:string, new_oauth_connected_user_entry_id:string):Promise<any>
  toggleServiceDisabled(service_setting_id:string):Promise<any>

  // Delete
  deleteServiceSetting(service_setting_id:string):Promise<any>
}