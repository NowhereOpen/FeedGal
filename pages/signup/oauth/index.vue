<template lang="pug">
div
  SignupOAuthPage
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator"
import SignupOAuthPage from "~/components/page-signup-oauth/index.vue"

@Component({ components: { SignupOAuthPage } })
export default class Page extends Vue {}
</script>
