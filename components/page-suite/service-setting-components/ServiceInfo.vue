<template lang="pug">
div
  v-container
    v-row
      div.service-name.title.mr-2 {{ serviceSetting.service_name }}
      div.caption.oauth-identity-container(
        v-if="hasOAuthIdentity()"
        :data-service-id="serviceSetting._id"
      )
        v-row(no-gutters)
          div.user-info Connected with '#[span.oauth-identity {{ getOAuthIdentity() }}]'
    
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator"

import { ServiceSetting } from "~/src/common/types/gyst-suite"

@Component
export default class ServiceInfo extends Vue {
  @Prop() serviceSetting!:ServiceSetting
  @Prop() isOauth!:boolean

  /**
   * Prevents "Cannot get 'user_info' of undefined" error thrown by non-oauth services
   * from `this.serviceSetting.oauth.user_info` in `getOAuthIdentity`.
   * 
   * And ... for OAuth services ... ALL have user info, don't they?
   * 
   * 2019-12-10 11:39 If ALL oauth services return user info, then the fixture data for
   * the test should be modified to have user_info if it's an oauth service.
   */
  hasOAuthIdentity() {
    return this.serviceSetting.is_oauth && this.serviceSetting.oauth_info!.is_connected && "user_info" in this.serviceSetting.oauth_info!
  }

  getOAuthIdentity() {
    const user_info = this.serviceSetting.oauth_info!.user_info!
    const identity = [user_info.friendly_name, user_info.user_id].find(entry => entry != undefined)
    return identity
  }
}
</script>