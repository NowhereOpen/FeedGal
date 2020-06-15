<template lang="pug">
span
  span(v-if="is_confirm == false")
    v-btn(
      small
      :disabled="disabled"
      @click="is_confirm = true"
    ) Revoke
  span(v-else)
    v-btn(
      small
      @click="is_confirm = false"
    ) Cancel
    v-btn(
      small
      color="red"
      @click="onRevokeConfirm"
    )
      v-progress-circular.mr-2(v-if="is_waiting" indeterminate size="20")
      span Revoke
</template>

<script lang="ts">
import { Component, Vue, State, Prop } from "nuxt-property-decorator"

@Component
export default class RevokeBtnComponent extends Vue {
  @Prop() disabled!:boolean

  is_confirm = false
  
  is_waiting = false

  reset() {
    this.is_confirm = false
    this.is_waiting = false
  }

  onRevokeConfirm() {
    this.is_waiting = true
    this.$emit('confirm', this.reset.bind(this))
  }
}
</script>