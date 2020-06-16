<template lang="pug">
div
  div.title Load status
  div
    div(v-if="is_general_error")
      div(v-if="is_no_service_settings_error")
        div Please connect accounts #[a(href="/settings/accounts") here] and update your suite #[a(href="/suite") here].
      div(v-else)
        div An error occured and the DEV forgot to handle it. SMH
    div(v-else)
      div(v-for="service_setting of load_status")
        LoadStatusEntry(
          :text="service_setting.service_name"
          :total="getServiceSettingTotal(service_setting)"
          :is_loading="getServiceSettingIsLoading(service_setting)"
          :is_warning="'warning' in service_setting"
          :warning_text="getWarningText(service_setting)"
          :is_error="'error' in service_setting"
          :error_text="getErrorText(service_setting)"
        )
        div.caption(
          v-if="service_setting.is_oauth && duplicateServiceIdExists(service_setting)"
        )
          span Connected with #[span.font-italic {{ getAccountNameForDuplicateServiceId(service_setting) }}]
        div.ml-2(v-if="service_setting.uses_setting_value")
          div(v-for="setting_value of getSettingValues(service_setting)")
            LoadStatusEntry(
              :text="setting_value.displayed_as"
              :total="setting_value.total"
              :is_loading="setting_value.is_loading"
              :is_warning="'warning' in setting_value"
              :warning_text="getWarningText(setting_value)"
              :is_error="'error' in setting_value"
              :error_text="getErrorText(setting_value)"
            )
</template>

<script lang="ts">
import { Vue, Component, State, Getter } from "nuxt-property-decorator"

import LoadStatusEntry from "./LoadStatusEntry.vue"

import { LoadStatus, LoadStatusServiceSetting, LoadStatusSettingValue, ClientSideField } from "~/src/common/types/loader"
import { GystEntryResponseErrorDetails } from "~/src/common/types/gyst-entry"

@Component({
  components: {
    LoadStatusEntry
  }
})
export default class GystEntryLoadStatus extends Vue {
  @State(state => state['loader'].load_status) load_status!:LoadStatus
  @Getter("loader/is_general_error") is_general_error!:boolean
  @Getter("loader/is_no_service_settings_error") is_no_service_settings_error!:boolean

  duplicateServiceIdExists(service_setting:LoadStatusServiceSetting) {
    const { _id: service_setting_id, service_id } = service_setting
    const result = this.load_status.some(service_setting => service_setting._id != service_setting_id && service_setting.service_id == service_id)
    return result
  }

  getAccountNameForDuplicateServiceId(service_setting:LoadStatusServiceSetting) {
    return service_setting.oauth_info!.user_info!.friendly_name || service_setting.oauth_info!.user_info!.user_id
  }

  getServiceSettingTotal(service_setting:LoadStatusServiceSetting) {
    return service_setting.uses_setting_value ?
      service_setting.setting_values.reduce((acc, setting_value) => acc += setting_value.total, 0) :
      service_setting.total
  }

  getServiceSettingIsLoading(service_setting:LoadStatusServiceSetting) {
    if(service_setting.is_disabled) {
      return false
    }

    return service_setting.uses_setting_value ?
      service_setting.setting_values.every((setting_value) => setting_value.is_loading || setting_value.is_invalid) :
      service_setting.is_loading
  }

  getSettingValues(service_setting:LoadStatusServiceSetting) {
    if("warning" in service_setting && service_setting.warning!.name == "DISABLED") {
      return []
    }
    else {
      return service_setting.setting_values
    }
  }

  getWarningText(entry:ClientSideField) {
    if("warning" in entry) {
      if(entry.warning!.name == "RATE_LIMIT") {
        return "'Rate limit' occurred for this service. May eventually load."
      }
      else {
        return entry.warning!.message
      }
    }
  }

  getErrorText(entry:ClientSideField) {
    return "error" in entry ? entry.error!.message : ""
  }
}
</script>