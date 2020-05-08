<template lang="pug">
div
  div
    v-navigation-drawer(
      :mini-variant="false"
      :clipped="true"
      fixed
      mobile-break-point=0
      app
    )
      NewGystSuiteEditor(
        v-on="$listeners"
        ref="new-gyst-suite-editor"
      )
      GystSuiteEditor(
        v-if="gystSuite != null"
        v-on="$listeners"
        v-bind="$props"
        ref="gyst-suite-editor"
      )
      v-card(v-if="gystSuite != null")
        v-card-title Other settings
        v-card-text
          div
            v-btn(
              :disabled="gystSuite.is_default"
              @click="onSetAsDefault"
            ) Set as Default
            div(
              v-if="gystSuite.is_default"
            ) Already default
          div
            v-switch(
              label="Public"
              v-model="gystSuite.is_public"
              @change="onPublicToggle"
            )
          div
            v-btn(
              :disabled="! gystSuite.is_public"
              :href="'/gyst-suite/' + gystSuite._id"
              target="_blank"
            ) Open in new tab
          div
            div Get GYST Widget for this GYST suite.
            v-btn(
              :disabled="! gystSuite.is_public"
            ) Get Widget
</template>

<script lang="ts">
import { Prop, Vue, Component } from "nuxt-property-decorator"

import NewGystSuiteEditor from "../side-panel-components/NewGystSuiteEditor.vue"
import GystSuiteEditor from "../side-panel-components/GystSuiteEditor.vue"

import { GystSuite, ServiceSetting } from "~/src/common/types/gyst-suite"

@Component({
  components: { NewGystSuiteEditor, GystSuiteEditor }
})
export default class SidePanel extends Vue {
  @Prop() gystSuite!:GystSuite

  onPublicToggle(new_value:boolean) {
    this.$emit("toggle-public", new_value)
  }

  onSetAsDefault() {
    this.$emit("set-as-default")
  }
}
</script>