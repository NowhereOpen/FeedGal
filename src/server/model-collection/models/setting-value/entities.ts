import { DeleteUser, DeleteResult } from "~/src/server/model-collection/model-base"

export interface ISettingValue extends DeleteUser {
  // Create
  createNewSettingValue(service_setting_id:string, setting_value:any):Promise<any>

  /**
   * Read (5)
   */
  getEntry(setting_value_id:string):Promise<any>
  // Used by the front end. Required so that user knows about the invalid setting values
  getAllSettingValues(service_setting_id:string):Promise<any>
  // Used on the server side to get gyst entries without having to care about invalid setting values.
  getValidSettingValues(service_setting_id:string):Promise<any>
  getServiceSettingTotalSettingValues(service_setting_id:string):Promise<number>
  settingValueExists(service_setting_id:string, setting_value:any): Promise<boolean>

  // Update (2)
  updateSettingValue(setting_value_id:string, setting_value:any):Promise<any>
  invalidateSettingValue(setting_value_id:string):Promise<any>

  /**
   * Delete (2)
   */
  deleteSettingValue(setting_value_id:string):Promise<any>
  // Useful when removing a service setting
  clearServiceSettingSettingValueValues(service_setting_id:string):Promise<any>
}