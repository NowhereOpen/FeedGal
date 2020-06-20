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
          div(v-if="isInUse() && info.length == 0")
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
import { Component, Vue, State, Prop } from "nuxt-property-decorator"

type Words = { action: string, actioning: string }

@Component
export default class RevokeRemoveConfirmBtnComponent extends Vue {
  @State(state => state["page-settings-accounts"].service_settings) service_settings!:any[]
  info:any[] = []
  comp:Vue = <any> null

  is_remove = false
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
  open(user_info:any, comp:Vue, words:Words) {
    this.words = words
    this.comp = comp
    /**
     * 2020-06-17 02:37 
     * 
     * Reset. Else this gets accumulatively bigger. Not haven't fully decided whether to use `v-if`
     * where this component is used, or to control `v-dialog` with a field in this component.
     */
    this.info = []

    this.is_open = true
    this.user_info = user_info

    this.service_settings.forEach(service_setting => {
      if(
        service_setting.is_oauth &&
        service_setting.oauth_info.is_connected &&
        service_setting.oauth_info.user_info.entry_id == this.user_info._id
      ) {
        this.info.push(service_setting)
      }
    })
  }

  onConfirmClick() {
    this.$emit('confirm', { user_info: this.user_info, comp: this.comp })
    this.is_open = false
  }

  isInUse() {
    return -1 < this.service_settings.findIndex(service_setting => service_setting.is_oauth && service_setting.oauth_info.is_connected && service_setting.oauth_info.user_info.entry_id == this.user_info._id)
  }
}
</script>