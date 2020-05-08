<template lang="pug">
div
  v-select.region-field(
    :value="value"
    @change="onChange"
    :items="lol_regions"
    item-text="name"
    item-value="platform"
    label="Region"
  )
    template(v-slot:item="{ item }")
      div.region-field-selectable {{ item.name }}  
</template>

<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator"

@Component
export default class LolRegionSelect extends Vue {
  @Prop() value!:any

  /**
   * For values:
   * https://developer.riotgames.com/docs/lol#_platform-routing-values
   * 
   * For abbreviation:
   * https://leagueoflegends.fandom.com/wiki/Servers
   * 
   * LA1, LA2 vs LAN, LAS:
   * https://www.reddit.com/r/leagueoflegends/comments/8lgsvs/how_to_change_to_any_language_in_lol_client/
   */
  lol_regions = [
    { name: "Korea", platform: "KR" },
    { name: "Japan", platform: "JP1" },
    { name: "NA", platform: "NA1" },
    { name: "EU nordic & east", platform: "EUN1" },
    { name: "EU west", platform: "EUW1" },
    { name: "Oceania", platform: "OC1" },
    { name: "Brazil", platform: "BR1" },
    { name: "LAN", platform: "LA1" },
    { name: "LAS", platform: "LA2" },
    { name: "Russia", platform: "RU" },
    { name: "Turkey", platform: "TR1" }
  ]

  onChange(value:any) {
    this.$emit('input', value)
  }
}
</script>