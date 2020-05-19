<template lang="pug">
div
  div(v-if="isAnon")
    btn Log in / Sign up
  div(v-else)
    v-menu(offset-y)
      template(v-slot:activator="{ on }")
        div(
          :style="{ cursor: 'pointer' }"
          v-on="on"
        ) User
      v-list
        v-list-item Log out
</template>

<script lang="ts">
import { Vue, Component, Prop } from "nuxt-property-decorator"

@Component
export default class AuthWidget extends Vue {
  @Prop() isAnon!:boolean
}
</script>