<template lang="pug">
div
  LolRegionSelect(v-model="value.region")
  v-text-field.summoner-name-field(
    v-model="value.summoner_name"
    label="Summoner name"
  )
</template>

<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator"

import { SettingValueEditorBase } from "~/src/cli/setting-value-editor/SettingValueEditor"

// Compopnents
import LolRegionSelect from "./LolRegionSelect.vue"
import SettingValueEditor from "../../SettingValueEditor.vue"

type EditorValue = { region: string, summoner_name: string }

@Component({
  components: { LolRegionSelect, SettingValueEditor }
})
export default class LolServiceSetting extends SettingValueEditorBase<EditorValue> {
  value:EditorValue = { region: "", summoner_name: "" }

  validateBeforeRequestImpl(new_value:EditorValue):string|void {
    if([new_value.region, new_value.summoner_name].some(str_val => str_val.trim() == "")) {
      return "Please fill both the region and the summoner name."
    }
  }

  renderValidationError(invalid_reason:any) {
    alert(invalid_reason)
  }
}
</script>