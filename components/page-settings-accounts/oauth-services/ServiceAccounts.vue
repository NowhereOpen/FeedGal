<template lang="pug">
div
  v-card.pa-2
    v-container.pa-0
      v-row(no-gutters)
        v-col User name: {{ account.service_user_id }}
        v-spacer
        v-col(
          v-if="account.error_with_access_token"
          cols="auto"
        )
          v-btn(
            :href="redirectUrl()"
            color="red"
          ) Reconnect
        v-col(cols="auto")
          v-btn(@click="onDisconnectClick") Disconnect
    div(v-if="account.is_signup") You signed up with this!
    div Connected at: {{ account.connected_at }}
    //- YYYY-MM-DD HH:mm
    //-
      Google is used in "Google calendar" and/or "YouTube", so it would be
      "My Guist Suite > YouTube" or something.
    div Used in:
      div.ml-2
        div(v-if="account.used_in.length > 0")
          div(v-for="service_setting of account.used_in")
            div {{ service_setting.gyst_suite_name }} &gt; {{ getServiceSettingName(service_setting) }}
        div(v-else) Nowhere...
        
    v-select(
      @change="onPrivacySettingChange"
      :value="account.privacy_setting"
      label="Privacy setting"
      :items="privacy_settings"
      item-text="name"
      item-value="value"
    )
              
</template>

<script lang="ts">
import { Vue, Component, Prop } from "nuxt-property-decorator"

import { ConnectedServiceAccount } from "~/src/common/types/connected-account"

import * as requestMaker from "~/src/cli/request-maker"
import { UrlsGystResource } from "~/src/common/urls"

@Component({
  components: {}
})
export default class ServiceAccounts extends Vue {
  @Prop() oauthServiceId!:string
  @Prop() account!:ConnectedServiceAccount

  privacy_settings = [
    { name: "Private", value: "private" },
    { name: "Public", value: "public" },
    { name: "To Gyst friends only", value: "gyst_friends" }
  ]

  onPrivacySettingChange(new_value:any) {
    console.log(`New value: ${new_value}`)
  }

  redirectUrl() {
    return UrlsGystResource.connectNewAccount(this.oauthServiceId)
  }

  /**
   * 2020-03-18 16:20
   * 
   * May need to be constructed on the server side with property name
   * `service_setting_display_name` or something.
   */
  getServiceSettingName(service_setting:any) {
    const name = service_setting.service_setting_service_name
    const alias = service_setting.service_setting_alias

    if(alias) {
      return `${alias} (${name})`
    }
    else {
      return name
    }
  }

  async onDisconnectClick() {
    await requestMaker.settings.user.disconnectService(this.account.oauth_connected_user_entry_id)

    this.$emit("disconnect")
  }
}
</script>