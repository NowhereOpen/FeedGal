import { loader_collection } from "~/src/server/loader-module-collection"

import { service_setting_storage } from "~/src/server/model-collection/models/service-setting"
import { setting_value_storage } from "~/src/server/model-collection/models/setting-value"

import { service_info_collection } from "~/src/server/loader-module-collection/service-info-collection"

export async function forAllSettingValuesInServiceSettings(service_settings:any[], cb:Function) {
  return await Promise.all(service_settings.map(async service_setting => getServiceSettingEntries(service_setting)))
}

export async function getServiceSettingEntries(service_setting:any) {
  const service_info = service_info_collection[service_setting.service_id]
  const uses_setting_value = service_info.uses_setting_value

  if(uses_setting_value) {
    await getServiceSettingEntriesWithSettingValues(service_setting)
  }
  else {
    await getServiceSettingEntriesWithoutSettingValues(service_setting)
  }
}

class GetServiceSettingEntries {
  service_setting_id:string
  service_id:string
  service_info:any
  service_setting:any

  constructor(service_setting:any) {
    this.service_setting = service_setting
    this.service_setting_id = service_setting._id
    this.service_id = service_setting.service_id
    this.service_info = service_info_collection[this.service_id]
  }

  async getEntries() {
    if(this.service_info.uses_setting_value) {
      await this.getServiceSettingEntriesWithSettingValues()
    }
    else {
      await this.getServiceSettingEntriesWithoutSettingValues()
    }
  }
  
  async getServiceSettingEntriesWithSettingValues() {  
    const _setting_value_entries = await setting_value_storage.getValidSettingValues(this.service_setting_id)
    const setting_value_entries = _setting_value_entries.map(setting_value => setting_value.toJSON())
  
    if(setting_value_entries.length == 0) {
  
    }
    else {
      setting_value_entries.forEach(async setting_value_entry => {
        const entries = await this.getSettingValueEntries(setting_value_entry)
      })
    }
  }

  async getServiceSettingEntriesWithoutSettingValues():Promise<any> {
    return loader_collection[this.service_id].getInitEntries()
  }
  
  async getSettingValueEntries(setting_value_entry:any):Promise<any> {
    return loader_collection[this.service_id].getInitEntries(setting_value_entry)
  }
}