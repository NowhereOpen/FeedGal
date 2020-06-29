<template lang="pug">
div
  div.main-container(:style="{ width: '1000px' }")
    div.header-container
      h1 Gyst suites

    v-container.pa-0
      v-row(no-gutters)
        v-col(cols="auto")
          span.title Service Settings ({{ getServiceSettingsLength() }})
        v-spacer
        v-col(cols="auto")
          v-btn(@click="is_service_setting_editor_open = true") Add New Service
      
    div.new-service-setting-editor(v-show="is_service_setting_editor_open")
      NewServiceSettingEditor(
        ref="new-service-setting-editor"
        v-bind="$data"
        @close="is_service_setting_editor_open = false"
      )

    div.gyst-suite-container
      GystSuite(ref="gyst-suite")

</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator"

import GystSuite from "~/components/page-suite/gyst-suite/GystSuite.vue"
import NewServiceSettingEditor from "~/components/page-suite/NewServiceSettingEditor.vue"

import { GystSuite as GystSuiteType, ServiceSetting } from "~/src/common/types/gyst-suite"

import * as requestMaker from "~/src/cli/request-maker"

@Component({
  components: { GystSuite, NewServiceSettingEditor }
})
export default class ServiceSettingPage extends Vue {
  is_service_setting_editor_open = false

  mounted() {
    const oauth_service_id = <string> this.$route.query.oauth_service_id
    const oauth_user_entry_id = <string> this.$route.query.oauth_user_entry_id

    if(oauth_service_id != undefined) {
      this.is_service_setting_editor_open = true
      let service_id = oauth_service_id
      if(service_id == "google") service_id = "youtube"
      ;(<NewServiceSettingEditor> this.$refs["new-service-setting-editor"]).chooseService(service_id, oauth_user_entry_id)
    }
  }

  getServiceSettingsLength() {
    return this.$store.state["page-suite"].service_settings.length
  }
}
</script>