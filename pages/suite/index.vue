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

    div.service-settings-container
      div(v-for="service_setting of service_settings" :key="service_setting._id")
        ServiceSetting(:service-setting="service_setting")

</template>

<script lang="ts">
import { Vue, Component, State } from "nuxt-property-decorator"

// Components
import NewServiceSettingEditor from "~/components/page-suite/NewServiceSettingEditor.vue"
import ServiceSetting from "~/components/page-suite/service-setting-components/ServiceSetting.vue"

// Types
import { ServiceSetting as ServiceSettingType } from "~/src/common/types/pages/suite"

@Component({
  components: {
    NewServiceSettingEditor,
    ServiceSetting
  }
})
export default class ServiceSettingPage extends Vue {
  // Vuex Store
  @State(state => state["page-suite"].suite_service_settings) service_settings!:ServiceSettingType[]

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
    return this.$store.state["page-suite"].suite_service_settings.length
  }
}
</script>