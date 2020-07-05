<template lang="pug">
div
  div.settings-container
    div(v-for="service_setting of service_settings" :key="service_setting._id")
      GoogleCalendarServiceSetting(
        v-if="service_setting.service_id == 'google-calendar'"
        :service-setting="service_setting"
        v-on="$listeners"
      )
      
      LolServiceSetting(
        v-else-if="service_setting.service_id == 'league-of-legends'"
        :service-setting="service_setting"
        v-on="$listeners"
      )

      GithubServiceSetting(
        v-else-if="service_setting.service_id == 'github'"
        :service-setting="service_setting"
        v-on="$listeners"
      )

      ServiceSetting(
        v-else
        :service-setting="service_setting"
        v-on="$listeners"
      )
</template>

<script lang="ts">
import { Vue, Component, State } from "nuxt-property-decorator"

// Components
import ServiceSetting from "../service-settings/basic/ServiceSetting.vue"
import GoogleCalendarServiceSetting from "../service-settings/google-calendar/GoogleCalendarServiceSetting.vue"
import GithubServiceSetting from "../service-settings/github/GithubServiceSetting.vue"
import LolServiceSetting from "../service-settings/league-of-legends/LolServiceSetting.vue"

// Types
import { ServiceInfo, ServiceSetting as ServiceSettingType } from "~/src/common/types/pages/suite"

import * as requestMaker from "~/src/cli/request-maker"

@Component({
  components: {
    ServiceSetting,
    GoogleCalendarServiceSetting,
    LolServiceSetting,
    GithubServiceSetting
  }
})
export default class GystSuite extends Vue {
  @State(state => state["page-suite"].service_settings) service_settings!:ServiceSetting[]

  mounted() {
    this.setupServiceSettingEventBus()
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

  async onRemoveServiceSetting(service_setting_id:string) {
    const { data } = await requestMaker.settings.gyst_suites.deleteServiceSetting(service_setting_id)

    this.$store.commit("page-suite/removeServiceSetting", service_setting_id)
  }

  onNewServiceSetting(service_setting:ServiceSetting) {
    this.$store.commit("page-suite/addNewServiceSetting", service_setting)
  }
}
</script>