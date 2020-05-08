<template lang="pug">
div
  v-expansion-panels
    v-expansion-panel
      v-expansion-panel-header(@click="onHeaderClick") Comments
      v-expansion-panel-content
        div.full-obj-container
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator"

@Component
export default class CommentLoader extends Vue {
  onHeaderClick() {
    console.log("Header clicked")
  }
}
</script>
