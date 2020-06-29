<template lang="pug">
div
  v-card.third-party-services-container.pa-0(no-gutters)
    v-card-title
      h2 Sign up or login
    v-card-text
      div With your favorite service
      v-container(no-gutters)
        v-row(
          v-for="(oauth_info, index) in oauth_infos"
          :key="index"
        )
          v-col.pa-0(auto)
            div.oauth-login-btn
              a.btn.btn-block.btn-social(
                :class="{ [oauth_info.btn_class]: true }"
                :href="getOAuthRedirectUrl(oauth_info)"
                :data-oauth-info-id="oauth_info.service_id"
              )
                span.fa(:class="{ [oauth_info.fa_value]: true } ")
                span #[span.oauth-info-name {{ oauth_info.service_name }}]
          v-col(auto)
            span #[span.oauth-total-signup {{ oauth_info.total_signup }}] Users Signed Up
            span &nbsp;
            span #[span.oauth-total-service-connected {{ oauth_info.total_service_connected }}] Users Connected
            span &nbsp;
            span #[span.oauth-total-accounts-connected {{ oauth_info.total_accounts_connected }}] Accounts Connected
</template>

<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator"

import { UrlsGystResource } from "~/src/common/urls"
import { OAuthInfo, OAuthInfos } from "~/src/common/types/pages/login"

@Component
export default class OAuthLoginComponent extends Vue {
  oauth_infos:OAuthInfo[] = []
  
  async loadSupportedOAuthServices(oauth_infos:OAuthInfos) {
    this.oauth_infos = Object.entries(oauth_infos).map((entry) => entry[1])

    this.oauth_infos = this.oauth_infos.map(oauth_info => {
      const icon_value = oauth_info.service_id
      return Object.assign(oauth_info, {
        btn_class: "btn-" + icon_value,
        fa_value: "fa-" + icon_value
      })
    })
  }

  /**
   * 2020-03-02 11:54
   * 
   * This can be attached from the backend. For details, refer to the comment "2020-03-02 11:53"
   * on `src/server-side-data-injections/page-login/index.ts`
   */
  getOAuthRedirectUrl(oauth_info:any) {
    const service_id = oauth_info.service_id
    return UrlsGystResource.loginWithOAuth(service_id)
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