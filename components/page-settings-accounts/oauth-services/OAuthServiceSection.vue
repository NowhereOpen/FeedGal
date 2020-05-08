<template lang="pug">
div
  v-card
    v-card-title
      div Connected OAuth service and accounts or &nbsp;
      v-btn(href="/settings/connect-new-account") Connect new account
    v-card-text
      div(v-for="(service_and_account, index) of service_and_account_collection")
        div.title {{ service_and_account.oauth_service_name }} ({{ service_and_account.accounts.length }} {{ getAccountName(service_and_account) }})

        div(
          v-for="(account, index) of service_and_account.accounts"
          v-key="account.oauth_connected_user_entry_id"
        )
          ServiceAccounts(
            :oauth-service-id="service_and_account.oauth_service_id"
            :account="account"
            @disconnect="removeAccount(index, account_index)"
          )
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator"

import ServiceAccounts from "./ServiceAccounts.vue"

import { ServiceAndAccount } from "~/src/common/types/connected-account"

@Component({
  components: { ServiceAccounts }
})
export default class OAuthServiceSetting extends Vue {
  service_and_account_collection:ServiceAndAccount[] = []

  loadOAuthServices(service_and_account_collection:ServiceAndAccount[]) {
    this.service_and_account_collection = service_and_account_collection
  }

  removeAccount(index:number, account_index:number) {
    this.service_and_account_collection[index].accounts.splice(account_index, 1)

    if(this.service_and_account_collection[index].accounts.length == 0) {
      this.service_and_account_collection.splice(index, 1)
    }
  }

  getAccountName(service_and_account:ServiceAndAccount) {
    const is_singular = service_and_account.accounts.length == 1
    const str = is_singular ? "account" : "accounts"

    return service_and_account.oauth_service_name + " " + str
  }
}
</script>