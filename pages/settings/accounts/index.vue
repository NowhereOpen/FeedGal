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
          div.mb-2
            div.oauth-login-btn
              a.btn.btn-block.btn-social(
                :class="{ [oauth_info.btn_class]: true }"
                :href="redirectUrl(oauth_info)"
                :data-oauth-info-id="oauth_info.service_id"
              )
                span.fa(:class="{ [oauth_info.fa_value]: true } ")
                span Add new #[span.oauth-info-name {{ oauth_info.service_name }}] account (#[span.accounts-connected {{ getTotalConnected(oauth_info.service_id) }}])
            div(v-if="'revoke_info' in oauth_info")
              span Manually revoke from #[a(:href="oauth_info.revoke_info.url") here]
              v-tooltip(bottom)
                template(v-slot:activator="{ on }")
                  v-icon.ml-1(v-on="on") info
                span {{ oauth_info.revoke_info.msg }}
              span .
          
          div
            div(v-for="oauth_user of oauth_info.all_connected_accounts" :key="oauth_user._id")
              div
                span.container
                  span {{ oauth_user.friendly_name || oauth_user.service_user_id }}
                  span(v-if="oauth_user.error_with_access_token")
                    v-tooltip(bottom)
                      template(v-slot:activator="{ on }")
                        RevokeBtn.ml-2(
                          @click="onRemoveClick(oauth_user, $event)"
                          text="Remove"
                        )
                      span It seems that you revoked your authorization. You can reconnect this account or remove.
                  span(v-else)
                    v-tooltip(bottom :disabled="oauth_user.is_signup == false")
                      template(v-slot:activator="{ on }")
                        span(v-on="on")
                          RevokeBtn.ml-2(
                            :disabled="isRevokeDisabled(oauth_user)"
                            @click="onRevokeClick(oauth_user, $event)"
                            text="Revoke"
                          )
                      span You signed up with this account.
              div
                span.caption Last connected on {{ oauth_user.connected_at }}

  hr.mt-4

  div.mt-4
    h1 Remove FeedGal Account
    v-btn(
      @click="onRemoveAccountClick"
    ) Remove

  //- Rendered conditionally
  RevokeRemoveConfirmDialog(
    ref="RevokeRemoveConfirmDialog"
    @confirm="onRevokeRemoveConfirm"
  )

  //- Rendered conditionally
  RemoveAccountConfirmDialog(
    ref="RemoveAccountConfirmDialog"
    @confirm="onRemoveAccountConfirm"
  )
</template>

<script lang="ts">
import axios from "axios"
import { Component, Vue, Mutation, State, Getter } from "nuxt-property-decorator"
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import { UrlsGystResource } from "~/src/common/urls"

import RevokeRemoveConfirmDialog from "~/components/page-settings-accounts/RevokeRemoveConfirmDialog.vue"
import RemoveAccountConfirmDialog from "~/components/page-settings-accounts/RemoveAccountConfirmDialog.vue"
import RevokeBtn from "~/components/page-settings-accounts/RevokeBtn.vue"

@Component({
  components: { RevokeBtn, RevokeRemoveConfirmDialog, RemoveAccountConfirmDialog }
})
export default class ConnectNewAccountPage extends Vue {
  @Mutation("page-settings-accounts/revokeOAuthAccount") revokeOAuthAccount!:Function
  @State(state => state["page-settings-accounts"].oauth_infos) oauth_infos!:any[]
  @Getter("page-settings-accounts/getTotalConnected") getTotalConnected!:Function

  redirectUrl(oauth_info:any) {
    return UrlsGystResource.connectNewAccount(oauth_info.service_id)
  }

  async onRevokeClick(oauth_user:any, comp:RevokeBtn) {
    ;(<RevokeRemoveConfirmDialog> this.$refs["RevokeRemoveConfirmDialog"]).open(oauth_user, comp, { action: "Revoke", actioning: "Revoking" })
  }

  async onRevokeRemoveConfirm({ user_info, comp }:{ user_info:any, comp:Vue }) {
    const revoke_btn = <RevokeBtn>comp
    revoke_btn.setIsWaiting(true)
    const url = UrlsGystResource.disconnectService(user_info._id)
    const { data } = await axios.post(url)
    this.revokeOAuthAccount(user_info.service_id, user_info._id)
    revoke_btn.setIsWaiting(false)
  }

  isRevokeDisabled(oauth_user:any) {
    return oauth_user.is_signup || oauth_user.error_with_access_token
  }

  onRemoveClick(oauth_user:any, comp:RevokeBtn) {
    ;(<RevokeRemoveConfirmDialog> this.$refs["RevokeRemoveConfirmDialog"]).open(oauth_user, comp, { action: "Remove", actioning: "Removing" })
    // const oauth_connected_user_entry_id = oauth_user._id
  }

  onRemoveAccountClick() {
    const comp = <RemoveAccountConfirmDialog> this.$refs["RemoveAccountConfirmDialog"]
    comp.open()
  }

  async onRemoveAccountConfirm() {
    const url = UrlsGystResource.deleteUser()
    await axios.delete(url)

    setTimeout(() => {
      this.$router.push("/")
    }, 1500)
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