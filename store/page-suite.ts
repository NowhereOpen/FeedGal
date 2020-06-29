import { Module, VuexModule, Mutation } from "vuex-module-decorators"

// Types
import {
  ServiceInfos,
  ServiceSettings,
  ServiceSetting,
  SettingValue
} from "~/src/common/types/pages/suite"

@Module({
  namespaced: true,
  stateFactory: false
})
export default class Store extends VuexModule {
  // Added service settings
  service_settings:ServiceSettings = []

  // Available service infos
  service_infos:ServiceInfos = []

  @Mutation
  setServiceSettings(service_settings:any) {
    this.service_settings = service_settings
  }

  @Mutation
  setSettingEditorServiceInfos(service_infos:any) {
    this.service_infos = service_infos
  }

  @Mutation
  removeServiceSetting(service_setting_id:string) {
    const index = this.service_settings.findIndex(entry => entry._id == service_setting_id)
    this.service_settings.splice(index, 1)
  }

  @Mutation
  addNewServiceSetting(service_setting:ServiceSetting) {
    this.service_settings.push(service_setting)
    this.service_settings.sort((a,b) => a.service_name.localeCompare(b.service_name))
  }

  @Mutation
  setIsDisabled({ service_setting, disabled }:{ service_setting:ServiceSetting, disabled:boolean }) {
    const target = this.service_settings.find(entry => service_setting == entry)!
    target!.is_disabled = disabled
  }

  @Mutation
  addNewSettingValue({ entry, service_setting }:{ entry:SettingValue, service_setting:ServiceSetting }) {
    const target = this.service_settings.find(entry => service_setting == entry)!
    target.setting_values.push(entry)
  }

  @Mutation
  updateSettingValue({ setting_value_id, service_setting, entry }:{ setting_value_id:string, service_setting:ServiceSetting, entry:SettingValue}) {
    const target = this.service_settings.find(entry => service_setting == entry)!
    const index = target.setting_values.findIndex((entry:any) => entry._id == setting_value_id)
    target.setting_values.splice(index, 1, entry)
  }

  @Mutation
  deleteSettingValue({ setting_value_id, service_setting}:{ setting_value_id:string, service_setting:ServiceSetting }) {
    const target = this.service_settings.find(entry => service_setting == entry)!
    const index = target.setting_values.findIndex((entry:any) => entry._id == setting_value_id)
    target.setting_values.splice(index, 1)
  }
}