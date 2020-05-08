<template lang="pug">
div
  SettingsAccountsPage
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"
import SettingsAccountsPage from "~/components/page-settings-accounts/index.vue"

@Component({ components: { SettingsAccountsPage } })
export default class Page extends Vue {}
</script>