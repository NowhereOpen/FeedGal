<template lang="pug">
div
  ServiceSetting(
    :service-setting="serviceSetting"
    :editor-default-value="default_value"
    v-bind="$attrs"
    v-on="$listeners"
  )
    template(v-slot:editor-body="{ editor }")
      LolRegionSelect(v-model="editor.value.region")
      v-text-field.summoner-name-field(
        v-model="editor.value.summoner_name"
        :error-messages="editor.validation === false ? [editor.error] : undefined"
        label="Summoner name"
      )
</template>

<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator"

// Compopnents
import ServiceSetting from "../basic/ServiceSetting.vue"
import LolRegionSelect from "./LolRegionSelect.vue"

// Types
import { ServiceSetting as ServiceSettingType } from "~/src/common/types/pages/suite"

@Component({
  components: { ServiceSetting, LolRegionSelect }
})
export default class LolServiceSetting extends ServiceSetting {
  @Prop() serviceSetting:any
  default_value = { region: "", summoner_name: "" }
}
</script>