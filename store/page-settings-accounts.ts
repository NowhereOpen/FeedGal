import { Module, VuexModule, Mutation } from "vuex-module-decorators"

import { OAuthInfos, ServiceSettings } from "~/src/common/types/pages/settings-accounts"

@Module({
  namespaced: true,
  stateFactory: false
})
export default class Store extends VuexModule {
  oauth_infos:OAuthInfos = []
  service_settings:ServiceSettings = []

  @Mutation
  revokeOAuthAccount(service_id:string, oauth_user_entry_id:string) {
    const oauth_info = this.oauth_infos.find(entry => entry.service_id == service_id)!
    const index = oauth_info.all_connected_accounts.findIndex(entry => entry._id == oauth_user_entry_id)
    oauth_info.all_connected_accounts.splice(index, 1)
  }

  get getTotalConnected() {
    return (service_id:string) => {
      const total = this.oauth_infos.find(entry => entry.service_id == service_id)!.all_connected_accounts.length
      return total
    }
  }
}