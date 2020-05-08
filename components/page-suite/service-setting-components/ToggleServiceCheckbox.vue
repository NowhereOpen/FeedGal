<template lang="pug">
div
  div(v-if="is_waiting == false")
    v-checkbox.toggle-service-check-box(
      :input-value="isDisabled"
      :label="getDisableCheckboxLabel()"
      @change="$emit('change')"
    )

  div(v-else)
    span Waiting for response
    v-progress-circular.ml-2(indeterminate size="20")  
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator"

@Component
export default class ToggleServiceCheckbox extends Vue {
  @Prop() isDisabled!:boolean

  is_waiting:boolean = false

  getDisableCheckboxLabel() {
    if(this.isDisabled) {
      return "Click to load this service"
    }
    else {
      return "Stop loading this service"
    }
  }

  setIsWaiting(value:boolean) {
    this.is_waiting = value
  }
}
</script>