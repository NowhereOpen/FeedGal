<template lang="pug">
div
  div.settings-container
    div(v-for="service_setting of service_settings")
      GoogleCalendarServiceSetting(
        v-if="service_setting.service_id == 'google-calendar'"
        :service-setting="service_setting"
        v-on="$listeners"
        v-bind="$data"
      )
      
      LolServiceSetting(
        v-else-if="service_setting.service_id == 'league-of-legends'"
        :service-setting="service_setting"
        v-on="$listeners"
        v-bind="$data"
      )

      ServiceSetting(
        v-else
        :service-setting="service_setting"
        v-on="$listeners"
        v-bind="$data"
      )
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator"
import ServiceSetting from "../service-settings/basic/ServiceSetting.vue"
import GoogleCalendarServiceSetting from "../service-settings/google-calendar/GoogleCalendarServiceSetting.vue"
import LolServiceSetting from "../service-settings/league-of-legends/LolServiceSetting.vue"

import { ServiceSetting as ServiceSettingType } from "~/src/common/types/gyst-suite"
import { ServiceInfo } from "~/src/common/types/service-info"

import * as requestMaker from "~/src/cli/request-maker"

@Component({
  components: {
    ServiceSetting,
    GoogleCalendarServiceSetting,
    LolServiceSetting
  }
})
export default class GystSuite extends Vue {
  service_settings:any[] = []

  mounted() {
    this.setupServiceSettingEventBus() 
    this.service_settings = this.$store.state["page-suite"].service_settings
  }

  /**
   * 2020-03-12 15:55
   * 
   * Service setting has "extended" service settings and this makes a few more layers between components. So, need to
   * add `v-on="$listeners"` to all those layers.
   * 
   * Instead, use a event bus to handle these events.
   */
  setupServiceSettingEventBus() {
    const service_setting_event_bus = new Vue()

    service_setting_event_bus.$on("new-service-setting", this.onNewServiceSetting)
    service_setting_event_bus.$on("remove-service-setting", this.onRemoveServiceSetting)

    Object.assign(this.$root, { service_setting_event_bus })
  }

  loadServiceSettings(service_settings:ServiceSettingType[]) {
    this.service_settings = service_settings
  }

  async onRemoveServiceSetting(service_setting_id:string) {
    const { data } = await requestMaker.settings.gyst_suites.deleteServiceSetting(service_setting_id)

    const index = this.service_settings.findIndex(entry => entry._id == service_setting_id)
    this.service_settings.splice(index, 1)
  }

  onNewServiceSetting(service_setting:ServiceSetting) {
    this.service_settings.push(service_setting)
    this.service_settings.sort((a,b) => a.service_name.localeCompare(b.service_name))
  }
}
</script>