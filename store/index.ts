export const actions = {
  /**
   * 2020-05-20 12:27
   * 
   * Ref: https://nuxtjs.org/guide/vuex-store/#the-nuxtserverinit-action
   * First argument is a 'state': https://vuex.vuejs.org/api/#actions
   * Second arugment is a 'context': https://nuxtjs.org/api/context/
   */
  nuxtServerInit(state:any, context:any) {
    const { commit } = state
    const { app, route, req } = context
    commit("session/setIsLoggedIn", req)
  }
}