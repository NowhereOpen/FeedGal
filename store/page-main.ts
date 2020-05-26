import { Module, VuexModule, Mutation } from "vuex-module-decorators"

@Module({
  namespaced: true,
  stateFactory: false
})
export default class Store extends VuexModule {
  /**
   * 2020-05-25 18:23
   * 
   * Refer to Server side data injection
   */
  load_status:any = {}

  /**
   * 2020-05-25 18:23
   * 
   * No mutation method is used at the moment.
   */
  // @Mutation
  // setLoadStatus(load_status:any) {
  //   this.load_status = load_status
  // }
}