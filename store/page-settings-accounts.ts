import { Module, VuexModule, Mutation } from "vuex-module-decorators"

@Module({
  namespaced: true,
  stateFactory: false
})
export default class Store extends VuexModule {
  oauth_infos:any[] = []

  @Mutation
  setOAuthInfos(oauth_infos:any[]) {
    this.oauth_infos = oauth_infos
  }
}