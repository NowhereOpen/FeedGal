<template lang="pug">
div
  v-container(no-gutters)
    v-row(
      v-for="(oauth_info, index) in oauth_infos"
      :key="index"
    )
      v-col.pa-0
        div.container(
          :class="{ [oauth_info.btn_class]: true }"
        )
          div.oauth-login-btn
            a.btn.btn-block.btn-social(
              :class="{ [oauth_info.btn_class]: true }"
              :href="redirectUrl(oauth_info)"
              :data-oauth-info-id="oauth_info.service_id"
            )
              span.fa(:class="{ [oauth_info.fa_value]: true } ")
              span Add new #[span.oauth-info-name {{ oauth_info.service_name }}] account (#[span.accounts-connected {{ getTotalConnected(oauth_info.service_id) }}])
          
          div.ml-4
            div(v-for="oauth_user of oauth_info.all_connected_accounts")
              span
                span.mr-2 {{ oauth_user.friendly_name || oauth_user.service_user_id }}
                RevokeBtn.mr-2(
                  @confirm="onRevokeConfirm($event, oauth_user)"
                )
                span.caption Last connected on {{ oauth_user.connected_at }}
</template>

<script lang="ts">
import axios from "axios"
import { Component, Vue, Mutation, State, Getter } from "nuxt-property-decorator"

import { UrlsGystResource } from "~/src/common/urls"

import RevokeBtn from "~/components/page-settings-accounts/RevokeBtn.vue"

@Component({
  components: { RevokeBtn }
})
export default class ConnectNewAccountPage extends Vue {
  @Mutation("page-settings-accounts/revokeOAuthAccount") revokeOAuthAccount!:Function
  @State(state => state["page-settings-accounts"].oauth_infos) oauth_infos!:any[]
  @Getter("page-settings-accounts/getTotalConnected") getTotalConnected!:Function

  redirectUrl(oauth_info:any) {
    return UrlsGystResource.connectNewAccount(oauth_info.service_id)
  }

  async onRevokeConfirm(reset:Function, oauth_user:any) {
    const url = UrlsGystResource.disconnectService(oauth_user._id)
    const { data } = await axios.post(url)
    this.revokeOAuthAccount(oauth_user.service_id, oauth_user._id)

    reset()
  }
}
</script>

<style lang="less">
/**
2020-03-02 22:02
Bootstrap v3 required for bootstrap-social
Could definitely use v4.4.1 (latest as of now) and copy the css from bootstrap-social.
What I need the most is the `.btn-social` "mixin" (in terms of sass).
 */
@import "~font-awesome/less/font-awesome.less";
@import "~bootstrap3/less/variables.less";
@import "~bootstrap3/less/mixins";
@import "~bootstrap3/less/buttons.less";
@import "~bootstrap-social/bootstrap-social.less";

.oauth-login-btn span {
  color: white
}

.btn-reddit {
  .btn-social(#ff5700)
}

.btn-twitch {
  .btn-social(#6441a5)
}

.btn-trello {
  .btn-social(#0079BF)
}
</style>