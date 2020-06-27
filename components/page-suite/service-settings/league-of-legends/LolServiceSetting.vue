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

    template(v-slot:setting-value="{ setting_value }")
      v-row
        div {{ setting_value.displayed_as }}
        //- 
          div.region Region:
            span.region-value {{ value.region }}
          div &nbsp;&nbsp;&nbsp;&nbsp;
          div.summoner-name Summoner name:
            span.summoner-name-value {{ value.summoner_name }}
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