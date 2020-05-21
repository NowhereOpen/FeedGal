import { Module, VuexModule, Mutation } from "vuex-module-decorators"

@Module({
  namespaced: true,
  stateFactory: false
})
export default class Store extends VuexModule {
  load_status:any = {}

  @Mutation
  setLoadStatus(load_status:any) {
    console.log("setLoadStatussetLoadStatussetLoadStatussetLoadStatussetLoadStatus")
    this.load_status = load_status
  }
}