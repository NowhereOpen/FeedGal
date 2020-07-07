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
          :disabled="is_editing"
          @click="onUpdateSettingValueClick(setting_value)"
        ) Update
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator"

import DeleteValueBtn from "./DeleteValueBtn.vue"

import { ServiceSetting, SettingValue } from "~/src/common/types/pages/suite"

@Component({
  components: { DeleteValueBtn }
})
export default class SettingValueContainer extends Vue {
  @Prop() serviceSetting!:ServiceSetting

  is_editing = false

  setIsEditing(value:boolean) {
    this.is_editing = value
  }

  onUpdateSettingValueClick(setting_value:any) {
    this.setIsEditing(true)
    this.$emit("update", setting_value)
  }

  onDeleteSettingValueClick(setting_value_id:string) {
    this.$emit("delete", setting_value_id)
  }
}
</script>