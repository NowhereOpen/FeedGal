import { Module, VuexModule, Mutation } from "vuex-module-decorators"

@Module({
  namespaced: true,
  stateFactory: false
})
export default class Store extends VuexModule {
  user_info:any = {}
  oauth_infos:any = {}

  @Mutation
  setUserInfo(user_info:any) {
    this.user_info = user_info
  }

  @Mutation
  setOAuthInfos(oauth_infos:any) {
    this.oauth_infos = oauth_infos
  }
}