<template lang="pug">
div
  MainPage
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator"
import MainPage from "~/components/page-index/index.vue"

@Component({ components: { MainPage } })
export default class Page extends Vue {}
</script>
