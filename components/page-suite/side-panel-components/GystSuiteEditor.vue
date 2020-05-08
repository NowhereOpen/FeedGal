<template lang="pug">
div
  v-card.selected-gyst-suite-editor-container
    v-card-title Edit selected Gyst Suite
    v-card-text
      div
        div(v-if="rename_form.is_active == false")
          v-btn(
            @click="rename_form.is_active = true"
          ) Rename Gyst Suite
        div(v-else)
          v-text-field(
            v-model="rename_form.value"
            label="Rename Gyst Suite"
          )
          v-btn(
            color="blue"
            @click="onRenameGystSuite"
          ) Confirm
          v-btn(
            @click="rename_form.is_active = false"
          ) Cancel
      div
        div(v-if="is_delete_active == false")
          v-tooltip(
            bottom
            :disabled="$attrs.gystSuite.is_default == false"
          )
            template(v-slot:activator="{ on }")
              //- Wrap in a `div` because `v-on="on"` doesn't work on a disabled button
              div(v-on="on")
                v-btn(
                  @click="is_delete_active = true"
                  :disabled="$attrs.gystSuite.is_default"
                ) Delete
            span You cannot delete a default gyst suite
        div(v-else)
          v-btn(
            @click="is_delete_active = false"
          ) Cancel
          v-btn(
            color="red"
            @click="onDeleteClick"
            :disabled="$attrs.gystSuite.is_default"
          ) Delete
</template>

<script lang="ts">
import { Prop, Vue, Component } from "nuxt-property-decorator"

import { GystSuite, ServiceSetting } from "~/src/common/types/gyst-suite"

@Component({
  components: {}
})
export default class GystSuiteEditor extends Vue {
  rename_form = {
    is_active: false,
    value: ""
  }

  is_delete_active = false

  created() {
    this.rename_form.value = (<GystSuite> <any>this.$attrs.gystSuite).gyst_suite_name
  }

  onDeleteClick() {
    this.$emit("delete-gyst-suite")
  }

  onRenameGystSuite() {
    this.$emit("update-gyst-suite-name", this.rename_form.value)
  }

  resetRenameEditor() {
    this.rename_form.is_active = false
    this.rename_form.value = ""
  }

  closeDelete() {
    this.is_delete_active = false
  }
}
</script>