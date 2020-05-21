import { Module, VuexModule, Mutation } from "vuex-module-decorators"

@Module({
  namespaced: true,
  stateFactory: false
})
export default class Store extends VuexModule {
  service_settings:any = {}
  service_setting_editor = {
    service_infos: {}
  }

  @Mutation
  setServiceSettings(service_settings:any) {
    this.service_settings = service_settings
  }

  @Mutation
  setSettingEditorServiceInfos(service_infos:any) {
    this.service_setting_editor.service_infos = service_infos
  }
}