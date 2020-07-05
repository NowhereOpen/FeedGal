import { Int32 } from "bson"

import { MongoStorage } from "~/src/server/model-collection/model-base"

import { IServiceSetting } from "./entities"
import { schema } from "./schema"

export class ServiceSettingStorage extends MongoStorage implements IServiceSetting {
  constructor(model_name:string) {
    super(model_name, schema)
  }

  async createNewServiceSetting(user_id:string, service_id:string, oauth_connected_user_entry_id:string, alias?:string):Promise<any> {
    return this.model.create({ user_id, service_id, oauth_connected_user_entry_id, alias })
  }

  async getAllServiceSettingsForUserId(user_id:string) {
    return this.model.find({ user_id })
  }

  async getAllServiceSettingsForOAuthConnectedUserEntryId(oauth_connected_user_entry_id:string) {
    return this.model.find({ oauth_connected_user_entry_id })
  }

  async getTotalServiceSettingsForUserId(user_id:string) {
    return this.model.countDocuments({ user_id })
  }

  async getEntry(service_setting_id:string) {
    return await this.model.findOne({ _id: service_setting_id })
  }

  async getServiceId(service_setting_id:string) {
    const result = await this.model.findOne({ _id: service_setting_id })
    return result!.get("service_id")
  }

  async getOAuthConnectedUserEntryId(service_setting_id:string) {
    const result = await this.model.findOne({ _id: service_setting_id })
    return result!.get("oauth_connected_user_entry_id")
  }

  async updateServiceSetting(service_setting_id:string, service_id:string) {

  }

  async updateOAuthConnectedUser(service_setting_id:string, new_oauth_connected_user_entry_id:string) {
    return this.model.updateOne({ _id: service_setting_id }, { oauth_connected_user_entry_id: new_oauth_connected_user_entry_id })
  }

  // async toggleServiceDisabled(service_setting_id:string):Promise<any> {
  //   await this.model.updateOne(
  //     { _id: service_setting_id },
  //     {
  //       $bit: {
  //         // Toggles value using `xor` and `Int32`
  //         is_disabled: { xor: <number> new Int32(1) }
  //       }
  //     },
  //     { upsert: true }
  //   )
  // }

  async deleteServiceSetting(service_setting_id:string):Promise<any> {
    return this.model.deleteOne({ _id: service_setting_id })
  }

  async deleteOAuthUser(oauth_connected_user_entry_id:string) {
    const result = await this.model.deleteMany({ oauth_connected_user_entry_id })
    const delete_count = result.deletedCount ? result.deletedCount : 0
    return {
      delete_count
    }
  }

  async deleteUser(user_id:string) {
    const result = await this.model.deleteMany({ user_id })
    return result
  }
}

export let service_setting_storage:ServiceSettingStorage

export function setup(model_name:string) {
  service_setting_storage = new ServiceSettingStorage(model_name)
  service_setting_storage.setup()
}