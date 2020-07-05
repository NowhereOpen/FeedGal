import { Module, VuexModule, Mutation } from "vuex-module-decorators"

// Types
import {
  EditorSelectables,
  SuiteServiceSettings,
  ServiceSetting,
  SettingValue
} from "~/src/common/types/pages/suite"

@Module({
  namespaced: true,
  stateFactory: false
})
export default class Store extends VuexModule {
  // Added service settings
  suite_service_settings:SuiteServiceSettings = []

  // Available service infos
  editor_selectables:EditorSelectables = []

  @Mutation
  setServiceSettings(service_settings:any) {
    this.suite_service_settings = service_settings
  }

  @Mutation
  setSettingEditorServiceInfos(editor_selectables:any) {
    this.editor_selectables = editor_selectables
  }

  @Mutation
  removeServiceSetting(service_setting_id:string) {
    const index = this.suite_service_settings.findIndex(entry => entry._id == service_setting_id)
    this.suite_service_settings.splice(index, 1)
  }

  @Mutation
  addNewServiceSetting(service_setting:ServiceSetting) {
    this.suite_service_settings.push(service_setting)
    this.suite_service_settings.sort((a,b) => a.service_name.localeCompare(b.service_name))
  }

  @Mutation
  addNewSettingValue({ entry, service_setting }:{ entry:SettingValue, service_setting:ServiceSetting }) {
    const target = this.suite_service_settings.find(entry => service_setting == entry)!
    target.setting_values.push(entry)
  }

  @Mutation
  updateSettingValue({ setting_value_id, service_setting, entry }:{ setting_value_id:string, service_setting:ServiceSetting, entry:SettingValue}) {
    const target = this.suite_service_settings.find(entry => service_setting == entry)!
    const index = target.setting_values.findIndex((entry:any) => entry._id == setting_value_id)
    target.setting_values.splice(index, 1, entry)
  }

  @Mutation
  deleteSettingValue({ setting_value_id, service_setting}:{ setting_value_id:string, service_setting:ServiceSetting }) {
    const target = this.suite_service_settings.find(entry => service_setting == entry)!
    const index = target.setting_values.findIndex((entry:any) => entry._id == setting_value_id)
    target.setting_values.splice(index, 1)
  }
}