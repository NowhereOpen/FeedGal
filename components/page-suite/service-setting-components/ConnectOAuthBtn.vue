<template lang="pug">
div
  v-tooltip(bottom)
    template(v-slot:activator="{ on }")
      v-btn(
        v-on="on"
        :href="getOAuthLink()"
        target="_blank"
      ) Connect
    span Refresh the page for changes  
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator"

// import { getOAuthRedirectUrl } from "~/lib/gyst/cli/util"

@Component
export default class ConnectOAuthBtn extends Vue {
  @Prop() serviceId!:string

  getOAuthLink() {
    // return getOAuthRedirectUrl(this.serviceId)
  }
}
</script>