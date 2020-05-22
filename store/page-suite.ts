import { Module, VuexModule, Mutation } from "vuex-module-decorators"
import { ServiceInfo } from "~/src/common/types/service-info"
import { ServiceSetting } from "~/src/common/types/gyst-suite"

@Module({
  namespaced: true,
  stateFactory: false
})
export default class Store extends VuexModule {
  // Added service settings
  service_settings:ServiceSetting[] = []

  // Available service infos
  service_infos:ServiceInfo[] = []

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
}