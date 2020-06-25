<template lang="pug">
div
  v-dialog(
    v-model="is_open"
    width='600'
    @click:outside="onClose"
  )
    v-card
      v-card-title Remove FeedGal Account
      v-card-text
        div Removing your FeedGal account will attempt to revoke all the accounts you connected, and remove all the suite settings as well.
      v-card-actions
        span(v-if="is_confirm == false")
          v-btn(
            @click="is_confirm = true"
          ) Remove
        span(v-else)
          v-btn(
            small
            @click="onClose"
          ) Cancel
          v-btn(
            v-if="is_confirm"
            small
            color="red"
            @click="onConfirmClick"
          ) Remove for real
</template>

<script lang="ts">
import { Component, Vue, State, Prop } from "nuxt-property-decorator"

type Words = { action: string, actioning: string }

@Component
export default class RevokeRemoveConfirmBtnComponent extends Vue {
  is_open = false
  is_confirm = false

  open() {
    this.is_open = true
  }

  onConfirmClick() {
    this.$emit('confirm')
  }

  onClose() {
    this.is_open = false
    this.is_confirm = false
  }
}
</script>