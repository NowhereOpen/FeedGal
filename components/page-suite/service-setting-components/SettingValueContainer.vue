<template lang="pug">
div
  v-container.values-container
    v-row.value-entry-container(
      v-for="(setting_value) of serviceSetting.setting_values"
      :key="String(Math.random())"
      :data-for-value="setting_value.value"
    )
      div.value-entry {{ setting_value.displayed_as }}

      v-spacer
      div.value-actions.d-flex
        div.invalid-value-info-container(v-if="setting_value.is_invalid")
          v-tooltip.invalid-value-info(bottom)
            template(v-slot:activator="{ on }")
              v-icon(
                color="red darken-2"
                v-on="on"
              ) info
            span This value is invalid and will not be used. Please update.
        
        DeleteValueBtn.mr-2(
          :disabled="is_editing"
          @confirm="onDeleteSettingValueClick(setting_value._id)"
        )
        
        v-btn.update(
          :disabled="isUpdateDisabled()"
          @click="onUpdateSettingValueClick(setting_value)"
        ) Update
</template>

<script lang="ts">
import { Component, Prop, Vue, Mutation } from "nuxt-property-decorator"

import * as requestMaker from "~/src/cli/request-maker"

// Components
import DeleteValueBtn from "./DeleteValueBtn.vue"

// Types
import { ServiceSetting, SettingValue } from "~/src/common/types/pages/suite"

@Component({
  components: { DeleteValueBtn }
})
export default class SettingValueContainer extends Vue {
  @Prop() serviceSetting!:ServiceSetting

  // Vuex Store
  @Mutation("page-suite/deleteSettingValue") deleteSettingValue!:Function

  is_editing = false

  isUpdateDisabled() {
    /**
     * 2020-07-07 12:31
     * Special case when service setting is oauth service. It requires user's access token when validating the value.
     * When it's not connected or is error, updating the value will fail when validating anyways. Disable it before
     * hand.
     */
    return this.is_editing ||
      (
        this.serviceSetting.is_oauth &&
        (this.serviceSetting.oauth_info?.is_connected == false || this.serviceSetting.oauth_info?.user_info?.is_error)
      )
  }

  setIsEditing(value:boolean) {
    this.is_editing = value
  }

  onUpdateSettingValueClick(setting_value:SettingValue) {
    this.setIsEditing(true)
    this.$emit("update", setting_value)
  }

  async onDeleteSettingValueClick(setting_value_id:string) {
    const { data } = await requestMaker.settings.suites.deleteSettingValue(setting_value_id)
    this.deleteSettingValue({ service_setting: this.serviceSetting, setting_value_id })
  }
}
</script>