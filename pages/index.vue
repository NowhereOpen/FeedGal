<template lang="pug">
div
  TestComp
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator"
import TestComp from "~/components/TestComp.vue"

@Component({
  components: { TestComp }
})
export default class IndexPage extends Vue {
}
</script>
