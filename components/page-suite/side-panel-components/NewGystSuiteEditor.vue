<template lang="pug">
div
  v-card.new-gyst-suite-editor-container
    v-card-title New Gyst Suite
    v-card-text
      div(v-if="is_gyst_suite_editor_open")
        div
          v-text-field(
            label="New Gyst Suite name"
            v-model="new_gyst_suite_name"
          )
        div
          v-btn(@click="onAddClick") Add
          v-btn(@click="is_gyst_suite_editor_open = false") Cancel
      div(v-else)
        v-btn(@click="is_gyst_suite_editor_open = true") Add New Gyst Suite
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator"

@Component({
  components: {}
})
export default class NewGystSuiteEditor extends Vue {
  is_gyst_suite_editor_open = false

  new_gyst_suite_name:string = ""

  async onAddClick() {
    this.$emit("new-gyst-suite", this.new_gyst_suite_name)
  }

  resetEditor() {
    this.is_gyst_suite_editor_open = false
    this.new_gyst_suite_name = ""
    return
  }

  setEditorError(error_message:string) {
  }
}
</script>