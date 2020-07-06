<template lang="pug">
div
  v-dialog(
    v-model="is_open"
    width='600'
  )
    v-card
      v-card-title {{ words.action }} Account
      v-card-text
        div {{ words.actioning }} the account will remove all the settings associated with this service account.
        div.mt-2
          div(v-if="! isInUse()")
            div This service is not being used.
          div(v-else)
            div(v-if="allServiceSettingsNoSettingValues()")
              div There is no settings associated with this service account.
            div(v-else)
              div(v-for="entry of getServiceSettings()")
                div {{ entry.service_name }}
                div(v-if="entry.uses_setting_value")
                  div(v-for="setting_value of entry.setting_values")
                    div.ml-2 {{ setting_value.displayed_as }}
      v-card-actions
        v-btn(
          small
          @click="is_open = false"
        ) Cancel
        v-btn(
          small
          color="red"
          @click="onConfirmClick"
        ) {{ words.action }}
</template>

<script lang="ts">
import { Component, Vue, Prop, State, Getter } from "nuxt-property-decorator"

// Types
import { OAuthConnectedUser } from "~/src/common/types/pages/settings-accounts"

type Words = { action: string, actioning: string }

@Component
export default class RevokeRemoveConfirmBtnComponent extends Vue {
  comp:Vue|null = null
  is_open = false
  user_info:OAuthConnectedUser|null = null

  words:Words = { action: "", actioning: "" }

  /**
   * 2020-06-17 03:10 
   * 
   * The `comp` is the button associated with calling this method. It will be sent back
   * in an event so that it can be controlled.
   * 
   * Had to take this approach because the button is used in a `v-for`, and I wanted to
   * keep this component only once instead of having it in all the button components
   * rendered with `v-for`.
   */
  open(user_info:OAuthConnectedUser, comp:Vue, words:Words) {
    this.words = words
    this.comp = comp

    this.is_open = true
    this.user_info = user_info
  }

  onConfirmClick() {
    this.$emit('confirm', { user_info: this.user_info, comp: this.comp })
    this.comp = null
    this.is_open = false
    this.user_info = null
  }

  isInUse() {
    return this.user_info == null ? false : this.user_info!.used_in.length > 0
  }

  /**
   * 2020-07-06 20:36
   * 
   * Does what the function name suggests. In some case of OAuth service (google) there
   * are more than one services associated. In such case, some service may allow setting
   * values and some don't. The user might be only using the services that don't allow
   * setting values (YouTube) but we don't know. That's why we have to check for setting
   * values or all service settings that rely on the oauth account.
   * 
   * That is, could 
   */
  allServiceSettingsNoSettingValues() {
    return this.getServiceSettings().every(service_setting => service_setting.uses_setting_value == false)
  }

  getServiceSettings() {
    return this.user_info == null ? [] : this.user_info.used_in
  }
}
</script>