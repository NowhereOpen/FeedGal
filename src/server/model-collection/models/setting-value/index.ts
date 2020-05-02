import { Int32 } from "bson"
import * as _ from "lodash"

import { MongoStorage } from "~/src/server/model-collection/model-base"

import { ISettingValue } from "./entities"
import { schema } from "./schema"

export class SettingValueStorage extends MongoStorage implements ISettingValue {
  constructor(model_name:string) {
    super(model_name, schema)
  }

  // Create
  async createNewSettingValue(service_setting_id:string, setting_value:any) {
    return this.model.create({ service_setting_id, value: setting_value })
  }

  /**
   * Read (5)
   */

  async getEntry(setting_value_id:string) {
    return this.model.findOne({ _id: setting_value_id })
  }

  // Used by the front end. Required so that user knows about the invalid setting values
  async getAllSettingValues(service_setting_id:string) {
    return this.model.find({ service_setting_id })
  }
  // Used on the server side to get gyst entries without having to care about invalid setting values.
  async getValidSettingValues(service_setting_id:string) {
    return this.model.find({ service_setting_id, is_invalid: false })
  }

  async getServiceSettingTotalSettingValues(service_setting_id:string):Promise<number> {
    const results = await this.model.find({ service_setting_id })
    return results.length
  }

  async settingValueExists(service_setting_id:string, setting_value:any):Promise<boolean> {
    const results = await this.model.find({ service_setting_id })
    const exists = results.find(entry => _.isEqual(setting_value, entry.get("value")))

    // If not null, it exists
    return exists != null
  }

  // Update (2)
  async updateSettingValue(setting_value_id:string, setting_value:any) {
    return this.model.updateOne(
      { _id: setting_value_id },
      { value: setting_value }
    )
  }
  
  async invalidateSettingValue(setting_value_id:string):Promise<any> {
    return this.model.update({ _id: setting_value_id }, { is_invalid: true })
  }

  /**
   * Delete (2)
   */
  async deleteSettingValue(setting_value_id:string):Promise<any> {
    return this.model.deleteOne({ _id: setting_value_id })
  }
  // Useful when removing a service setting
  async clearServiceSettingSettingValueValues(service_setting_id:string):Promise<any> {
    return this.model.deleteMany({ service_setting_id })
  }

  async deleteUser(user_id:any) {
    return { delete_count: 0 }
  }
}

export let setting_value_storage:SettingValueStorage

export function setup(model_name:string) {
  setting_value_storage = new SettingValueStorage(model_name)
  setting_value_storage.setup()
}