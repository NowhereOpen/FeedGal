<template lang="pug">
div
  div(v-show="disabled == true || is_confirming == false")
    v-btn.delete(
      :disabled="disabled"
      @click="is_confirming = true"
    ) Delete
  div(v-show="is_confirming == true && disabled == false")
    v-btn.delete-confirm(
      @click="onConfirmClick"
    )
      span Delete
      v-progress-circular.ml-2(v-if="is_waiting" indeterminate size="20")
    v-btn.delete-cancel(
      @click="is_confirming = false"
    ) Cancel
</template>

<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator"

@Component
export default class DeleteValueBtnComp extends Vue {
  @Prop() disabled!:boolean
  is_confirming = false
  is_waiting = false

  async onConfirmClick() {
    this.$emit("confirm")
  }
}
</script>