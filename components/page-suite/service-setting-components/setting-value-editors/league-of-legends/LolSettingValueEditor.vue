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

import { LeagueOfLegendsInvalidReason, InvalidReason } from "~/src/common/types/common/setting-value-validation"
import { LeagueOfLegends } from "~/src/common/setting-value-validation/validate"
import { LeagueOfLegendsSettingValue } from "~/src/common/types/common/setting-value"

import { SettingValueEditorBase } from "~/src/cli/setting-value-editor/SettingValueEditor"

// Compopnents
import LolRegionSelect from "./LolRegionSelect.vue"
import SettingValueEditor from "../../SettingValueEditor.vue"

@Component({
  components: { LolRegionSelect, SettingValueEditor }
})
export default class LolServiceSetting extends SettingValueEditorBase<LeagueOfLegendsSettingValue> {
  value:LeagueOfLegendsSettingValue = { region: "", summoner_name: "" }

  validateBeforeRequestImpl(new_value:LeagueOfLegendsSettingValue):LeagueOfLegendsInvalidReason|undefined {
    return LeagueOfLegends.validate(new_value)
  }

  renderValidationError(invalid_reason:InvalidReason) {
    alert(invalid_reason)
  }
}
</script>