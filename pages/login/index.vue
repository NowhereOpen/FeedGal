<template lang="pug">
div
  LoginPage
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator"
import LoginPage from "~/components/page-login/index.vue"

@Component({
  components: { LoginPage }
})
export default class Page extends Vue {}
</script>
