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
          :is_error="getErrorTextServiceSetting(service_setting) != undefined"
          :error_text="getErrorTextServiceSetting(service_setting)"
        )
        div.caption(
          v-if="service_setting.is_oauth && duplicateServiceIdExists(service_setting)"
        )
          span Connected with #[span.font-italic {{ getAccountNameForDuplicateServiceId(service_setting) }}]
        div.ml-2(v-if="service_setting.uses_setting_value && getErrorTextServiceSetting(service_setting) == undefined")
          div(v-for="setting_value of getSettingValues(service_setting)")
            LoadStatusEntry(
              :text="setting_value.displayed_as"
              :total="setting_value.total"
              :is_loading="setting_value.is_loading"
              :is_warning="'warning' in setting_value"
              :warning_text="getWarningText(setting_value)"
              :is_error="getErrorTextSettingValue(setting_value) != undefined"
              :error_text="getErrorTextSettingValue(setting_value)"
            )
</template>

<script lang="ts">
import _ from "lodash"
import { Vue, Component, State, Getter } from "nuxt-property-decorator"

import { RATE_LIMIT } from "~/src/common/warning-error"

// Compopnents
import LoadStatusEntry from "./LoadStatusEntry.vue"

// Types
import {
  LoadStatus,
  LoadStatusServiceSetting,
  LoadStatusSettingValue,
  ClientSideField
} from "~/src/common/types/pages/main"

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
    if(service_setting.uses_setting_value) {
      const valid_setting_values = service_setting.setting_values.filter(setting_value => setting_value.is_invalid == false)
      return valid_setting_values.length == 0 ? false : valid_setting_values.every((setting_value) => setting_value.is_loading)
    }
    else {
      return service_setting.is_loading
    }
  }

  getSettingValues(service_setting:LoadStatusServiceSetting) {
    return service_setting.setting_values
  }

  getWarningText(entry:ClientSideField) {
    if("warning" in entry) {
      if(entry.warning!.name == RATE_LIMIT.name) {
        return entry.warning!.message
      }
      else {
        return entry.warning!.message
      }
    }
  }

  getErrorTextCommon(entry:ClientSideField):string|undefined {
    if("error" in entry) {
      return entry.error!.message
    }
  }

  getErrorTextServiceSetting(service_setting:LoadStatusServiceSetting) {
    const error = this.getErrorTextCommon(service_setting)
    if(error) {
      return error
    }
    else if(_.get(service_setting, "oauth_info.user_info.is_error", false)) {
      return "Please reconnect your service account."
    }
  }

  getErrorTextSettingValue(setting_value:LoadStatusSettingValue) {
    const error = this.getErrorTextCommon(setting_value)
    if(error) {
      return error
    }
    else if(setting_value.is_invalid) {
      /**
       * Same error message as `INVALID_SETTING_VALUE`
       */
      return "Please update your setting."
    }
  }
}
</script>