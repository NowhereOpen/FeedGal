import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators"

import * as requestMaker from "~/src/cli/request-maker"

// Types
import { OAuthInfos } from "~/src/common/types/pages/settings-accounts"
import { State, OAuthConnectedUser } from "~/src/common/types/pages/settings-accounts"

@Module({
  namespaced: true,
  stateFactory: false
})
export default class Store extends VuexModule implements State {
  oauth_infos:OAuthInfos = []
  oauth_connected_accounts:OAuthConnectedUser[] = []

  @Mutation
  _revokeOAuthAccount(oauth_user_entry_id:string) {
    const index = this.oauth_connected_accounts.findIndex(entry => entry._id == oauth_user_entry_id)
    this.oauth_connected_accounts.splice(index, 1)
  }

  @Action({ commit: "_revokeOAuthAccount" })
  async revokeOAuthAccount(oauth_user_entry_id:string) {
    const { data } = await requestMaker.settings.user.revokeRemoveConfirm(oauth_user_entry_id)
    const  oauth_service_id = data.oauth_service_id
    return oauth_user_entry_id
  }

  get getTotalConnected() {
    return (service_id:string) => {
      const total = this.oauth_connected_accounts.filter(entry => entry.service_id == service_id)!.length
      return total
    }
  }
}