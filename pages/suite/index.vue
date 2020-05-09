<template lang="pug">
div
  SuitePage
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator"
import SuitePage from "~/components/page-suite/index.vue"

@Component({ components: { SuitePage } })
export default class Page extends Vue {
  mounted() {
    console.log(this)
    console.log(this.service_settings)
  }
}
</script>