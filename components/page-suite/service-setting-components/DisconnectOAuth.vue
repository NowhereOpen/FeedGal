<template lang="pug">
div
  //- Disconnect component
  div(v-if="[undefined, null, false].includes(isSignup)")
    v-btn.disconnect-btn(
      @click="$emit('click')"
    )
      div Disconnect
      v-progress-circular.ml-2(v-if="is_waiting" indeterminate size="20")

  //- Replaces 'disconnect' components
  div.signup-service-container(v-else)
    v-tooltip(left)
      template(v-slot:activator="{ on }")
        v-icon(v-on="on") info
      span You signed up with this service.
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator"

@Component
export default class DisconnectOAuth extends Vue {
  @Prop() isSignup!:boolean
  @Prop() serviceId!:boolean

  is_waiting:boolean = false

  setIsWaiting(value:boolean) {
    this.is_waiting = value
  }
}
</script>