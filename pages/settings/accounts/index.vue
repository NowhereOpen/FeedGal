<template lang="pug">
div
  v-container(no-gutters)
    v-row(
      v-for="(oauth_info, index) in oauth_infos"
      :key="index"
    )
      v-col.pa-0
        div.oauth-login-btn
          a.btn.btn-block.btn-social(
            :class="{ [oauth_info.btn_class]: true }"
            :href="redirectUrl(oauth_info)"
            :data-oauth-info-id="oauth_info.service_id"
          )
            span.fa(:class="{ [oauth_info.fa_value]: true } ")
            span #[span.oauth-info-name {{ oauth_info.service_name }}] (#[span.accounts-connected {{ oauth_info.total_connected }}])
</template>

<script lang="ts">
import { Component, Vue, State } from "nuxt-property-decorator"
import { UrlsGystResource } from "~/src/common/urls"

@Component
export default class ConnectNewAccountPage extends Vue {
  oauth_infos:any[] = []

  mounted() {
    const _oauth_infos = this.$store.state['page-settings-accounts'].oauth_infos
    this.oauth_infos = _oauth_infos.map((oauth_info:any) => {
      const icon_value = oauth_info.service_id
      return Object.assign(oauth_info, {
        btn_class: "btn-" + icon_value,
        fa_value: "fa-" + icon_value
      })
    })
  }

  redirectUrl(oauth_info:any) {
    return UrlsGystResource.connectNewAccount(oauth_info.service_id)
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