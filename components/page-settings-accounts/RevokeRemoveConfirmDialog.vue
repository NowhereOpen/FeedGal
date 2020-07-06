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
          div(v-if="! is_in_use")
            div This service is not being used.
          div(v-if="is_in_use && info.length == 0")
            div There is no settings associated with this service account.
          div(v-else)
            div(v-for="entry of info")
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
import { ServiceSettings, OAuthConnectedUser } from "~/src/common/types/pages/settings-accounts"

type Words = { action: string, actioning: string }

@Component
export default class RevokeRemoveConfirmBtnComponent extends Vue {
  @Getter("page-settings-accounts/getServiceSettingsUsedByOAuthAccount") getServiceSettingsUsedByOAuthAccount!:Function
  @Getter("page-settings-accounts/isOAuthAccountInUse") isOAuthAccountInUse!:Function

  comp:Vue|null = null
  info:any[] = []
  is_in_use = false
  is_open = false
  user_info:any = {}

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
    this.info = this.getServiceSettingsUsedByOAuthAccount(user_info._id)
    this.is_in_use = this.isOAuthAccountInUse()
  }

  onConfirmClick() {
    this.$emit('confirm', { user_info: this.user_info, comp: this.comp })
    this.comp = null
    this.info = []
    this.is_in_use = false
    this.is_open = false
    this.user_info = {}
  }
}
</script>