import { Module, VuexModule, Mutation } from "vuex-module-decorators"

@Module({
  namespaced: true,
  stateFactory: true
})
export default class Store extends VuexModule {
  is_logged_in = false

  @Mutation
  setIsLoggedIn(req:any) {
    this.is_logged_in = req.session && "user_id" in req.session
  }
}