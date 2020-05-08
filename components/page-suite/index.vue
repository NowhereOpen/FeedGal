<template lang="pug">
div
  client-only
    SidePanel(
      ref="side-panel"
      :gyst-suite="selected_gyst_suite"
      @new-gyst-suite="onNewGystSuite"
      @update-gyst-suite-name="onUpdateGystSuiteName"
      @delete-gyst-suite="onDeleteGystSuite"
      @set-as-default="onSetAsDefault"
      @toggle-public="onTogglePublicGystSuite"
    )

  div.main-container(:style="{ width: '1000px' }")
    div.header-container
      h1 Gyst suites

    div
      v-select(
        v-model="target_gyst_suite_id"
        :label="getSelectGystSuiteLabel()"
        :items="gyst_suites"
        :item-text="getGystSuiteName"
        item-value="_id"
        @change="onGystSuiteChange"
      )

    v-container.pa-0
      v-row(no-gutters)
        v-col(cols="auto")
          span.title Service Settings (Total)
        v-spacer
        v-col(cols="auto")
          v-btn(@click="is_service_setting_editor_open = true") Add New Service
      
    div.new-service-setting-editor(v-show="is_service_setting_editor_open")
      NewServiceSettingEditor(
        ref="new-service-setting-editor"
        v-bind="$data"
        @close="is_service_setting_editor_open = false"
        :gyst-suite-id="target_gyst_suite_id"
      )

    div.gyst-suite-container
      GystSuite(
        ref="gyst-suite"
        @update-oauth-account="onUpdateOAuthAccount"
      )

</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator"

import SidePanel from "./side-panel/SidePanel.vue"
import NewGystSuiteEditor from "./side-panel-components/NewGystSuiteEditor.vue"
import GystSuiteEditor from "./side-panel-components/GystSuiteEditor.vue"

import GystSuite from "./gyst-suite/GystSuite.vue"
import NewServiceSettingEditor from "./NewServiceSettingEditor.vue"

import { GystSuite as GystSuiteType, ServiceSetting } from "~/src/common/types/gyst-suite"

import * as requestMaker from "~/src/cli/request-maker"

@Component({
  components: { SidePanel, GystSuite, NewServiceSettingEditor }
})
export default class ServiceSettingPage extends Vue {
  // Can be injected from the server side
  gyst_suites:GystSuiteType[] = []

  // For injection only. Use `GystSuite.loadServiceSettings` to load after init loading.
  service_settings:ServiceSetting[] = []

  // Used in NewServiceSettingEditor
  service_setting_editor = {
    service_infos: []
  }

  is_service_setting_editor_open = false
  target_gyst_suite_id:any = null
  selected_gyst_suite:GystSuiteType = <any> null

  mounted() {
    if(this.gyst_suites.length == 0) return
    
    const default_gyst_suite = <GystSuiteType> this.gyst_suites.find(entry => entry.is_default)

    /**
     * 2020-03-12 14:44
     * 
     * Not usually allowed, but there can be no default gyst suite for some reason. But it SHOULD
     * work fine.
     */
    if(default_gyst_suite != null) {
      this.selectGystSuite(default_gyst_suite._id)
    }
    
    ;(<GystSuite>this.$refs["gyst-suite"]).loadServiceSettings(this.service_settings)
    ;(<GystSuite>this.$refs["gyst-suite"]).loadServiceInfos(this.service_setting_editor.service_infos)
    ;(<NewServiceSettingEditor>this.$refs["new-service-setting-editor"]).loadServiceInfos(this.service_setting_editor.service_infos)
  }

  selectGystSuite(target_id:string) {
    const target_gyst_suite = <GystSuiteType> this.gyst_suites.find(entry => entry._id == target_id)
    this.target_gyst_suite_id = target_gyst_suite._id
    this.selected_gyst_suite = target_gyst_suite
  }

  getGystSuiteName(gyst_suite:any) {
    let name = `${gyst_suite.gyst_suite_name} (${gyst_suite.total_settings})`
    if(gyst_suite.is_public) {
      name += " (Public)"
    }
    if(gyst_suite.is_default) {
      name += " (Default)"
    }
    return name
  }

  getSelectGystSuiteLabel() {
    return `Total (${this.gyst_suites.length})`
  }

  onUpdateOAuthAccount(cb:Function) {
    cb(this.selected_gyst_suite._id)
  }

  async onGystSuiteChange(target_gyst_suite_id:string) {
    this.changeGystSuite(target_gyst_suite_id)
  }

  async changeGystSuite(target_gyst_suite_id:string) {
    this.selectGystSuite(target_gyst_suite_id)

    const { data } = await requestMaker.settings.gyst_suites.getGystSuiteServiceSettings(target_gyst_suite_id)

    this.service_settings = data.service_settings
    ;(<GystSuite>this.$refs["gyst-suite"]).loadServiceSettings(this.service_settings)
  }

  async onNewGystSuite(new_gyst_suite_name:string) {
    const { data } = await requestMaker.settings.gyst_suites.createNewGystSuite(new_gyst_suite_name)

    if(data.success == false) {
      const error_message = data.error.message
      ;(<NewGystSuiteEditor>(<SidePanel> this.$refs["side-panel"]).$refs["new-gyst-suite-editor"]).setEditorError(error_message)
      return
    }

    ;(<NewGystSuiteEditor>(<SidePanel> this.$refs["side-panel"]).$refs["new-gyst-suite-editor"]).resetEditor()

    const new_gyst_suite:GystSuiteType = data.gyst_suite

    this.gyst_suites.push(new_gyst_suite)
    this.gyst_suites.sort((a,b) => a.gyst_suite_name.localeCompare(b.gyst_suite_name))

    // First gyst suite added
    if(this.gyst_suites.length == 1) {
      this.changeGystSuite(new_gyst_suite._id)
    }
  }

  async onUpdateGystSuiteName(new_gyst_suite_name:string) {
    const { data } = await requestMaker.settings.gyst_suites.updateGystSuiteName(this.target_gyst_suite_id, new_gyst_suite_name)

    ;(<GystSuiteEditor>(<SidePanel> this.$refs["side-panel"]).$refs["gyst-suite-editor"]).resetRenameEditor()
  }

  async onDeleteGystSuite() {
    const { data } = await requestMaker.settings.gyst_suites.deleteGystSuite(this.selected_gyst_suite._id)

    const index = this.gyst_suites.findIndex(entry => entry._id == this.selected_gyst_suite._id)
    this.gyst_suites.splice(index, 1)

    ;(<GystSuiteEditor>(<SidePanel> this.$refs["side-panel"]).$refs["gyst-suite-editor"]).closeDelete()

    const default_gyst_suite = this.gyst_suites.find(entry => entry.is_default)
    await this.changeGystSuite(default_gyst_suite!._id)
  }

  async onSetAsDefault() {
    const gyst_suite_id = this.target_gyst_suite_id
    const { data } = await requestMaker.settings.gyst_suites.setAsDefault(gyst_suite_id)

    this.gyst_suites.forEach(entry => {
      if(entry._id == gyst_suite_id) {
        entry.is_default = true
      }
      else {
        entry.is_default = false
      }
    })
  }

  async onTogglePublicGystSuite(new_value:boolean) {
    const { data } = await requestMaker.settings.gyst_suites.setAsPublic(this.target_gyst_suite_id, new_value)

    const index = this.gyst_suites.findIndex(entry => entry._id == this.target_gyst_suite_id)
    this.gyst_suites[index].is_public = data.result.is_public
  }
}
</script>