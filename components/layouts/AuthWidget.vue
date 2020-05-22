<template lang="pug">
div
  div(v-if="is_logged_in == false")
    v-btn(href="/login") Log in / Sign up
  div(v-else)
    v-menu(offset-y)
      template(v-slot:activator="{ on }")
        div(
          :style="{ cursor: 'pointer' }"
          v-on="on"
        ) User
      v-list
        v-list-item(
          @click="onLogoutClick()"
        ) Log out
</template>

<script lang="ts">
import { Vue, Component, Prop, State } from "nuxt-property-decorator"
import * as requestMaker from "~/src/cli/request-maker"

@Component
export default class AuthWidget extends Vue {
  @State(state => state.session.is_logged_in) is_logged_in!:boolean

  async onLogoutClick() {
    await requestMaker.user.logout()
    location.reload()
  }
}
</script>