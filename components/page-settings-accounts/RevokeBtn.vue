<template lang="pug">
span
  span
    v-btn(
      small
      :disabled="disabled"
      @click="onClick"
    )
      v-progress-circular.mr-2(v-if="is_waiting" indeterminate size="20")
      span Revoke
</template>

<script lang="ts">
import { Component, Vue, State, Prop } from "nuxt-property-decorator"

@Component
export default class RevokeBtnComponent extends Vue {
  @Prop() disabled!:boolean
  is_waiting = false

  setIsWaiting(value:boolean) {
    this.is_waiting = value
  }

  onClick() {
    this.$emit('click', this)
  }
}
</script>