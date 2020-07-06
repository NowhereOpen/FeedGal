import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators"

import * as requestMaker from "~/src/cli/request-maker"

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
  _removeServiceSetting(index:number) {
    this.suite_service_settings.splice(index, 1)
  }

  @Action({ commit: "_removeServiceSetting" })
  async removeServiceSetting(service_setting_id:string) {
    const index = this.suite_service_settings.findIndex(entry => entry._id == service_setting_id)
    const { data } = await requestMaker.settings.suites.deleteServiceSetting(service_setting_id)
    return index
  }

  @Mutation
  _addNewServiceSetting(service_setting:ServiceSetting) {
    this.suite_service_settings.push(service_setting)
    this.suite_service_settings.sort((a,b) => a.service_name.localeCompare(b.service_name))
  }

  @Action({ commit: "_addNewServiceSetting" })
  async addNewServiceSetting({ service_id, oauth_account_entry_id }:{ service_id:string, oauth_account_entry_id:string|undefined }) {
    const { data } = await requestMaker.settings.suites.addNewServiceSetting(
      service_id,
      oauth_account_entry_id
    )
    const service_setting = data.service_setting
    return service_setting
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