<template lang="pug">
div
  div
    div
      span {{ data.service_name }} ({{ total_loaded }})
      v-progress-circular.ml-2(v-if="is_loading" indeterminate size="20")

    div.ml-2
      div(v-if="error != null")
        div(v-if="error.name == 'NO_SETTING_VALUES'")
          div.warning No setting values
        div(v-else-if="error.name == 'ERROR_ON_REFRESH_TOKEN'")
          div.error Please connect the service again.
        div(v-else-if="error.name == 'DEV_FAULT'")
          div.error {{ error.message }}
        div(v-else-if="error.name == 'OAUTH_CONNECTED_USER_NOT_EXIST'")
          div.error Connected account has been deleted. Please update the service setting.
      div(v-for="setting_value of data.setting_values")
        SettingValueStatus(
          :data="setting_value"
          ref="setting-value-status"
        )
</template>

<script lang="ts">
import { Vue, Component, Prop } from "nuxt-property-decorator"

import SettingValueStatus from "./SettingValueStatus.vue"

import {
  GystEntryResponse,
  GystEntryResponseSuccess,
  GystEntryResponseError,
  GystEntryPaginationResponse,
  GystEntryResponseErrorDetails,
  PaginationData
} from "~/src/common/types/gyst-entry"
import { ServiceSetting } from "~/src/common/types/gyst-suite"
import { Loadable } from "~/src/cli/gyst-entry-load-status/base"

@Component({
  components: {
    SettingValueStatus
  }
})
export default class ServiceSettingStatus extends Loadable {
  @Prop() data!:ServiceSetting
  
  error:GystEntryResponseErrorDetails|null = null

  startLoading() {
    if(this.is_error || this.data.is_disabled) {
      return
    }

    this.is_loading = true

    if(this.data.uses_setting_value) {
      this.getSettingValueStatusComponents().forEach(comp => comp.startLoading())
    }
  }

  callSettingValueUpdateStatus(response:GystEntryResponseSuccess|GystEntryResponseError) {
    const setting_value = this.getSettingValueStatusComponents().find(entry => entry.data._id == response.setting_value_id)

    /**
     * 2020-03-24 08:24
     * 
     * Called by both `handleDataResponse` and `handleErrorResponse`.
     * This if statement prevents error for service settings without setting value.
     */
    if(setting_value == undefined) {
      return
    }

    setting_value!.updateStatus(response)
  }

  handleDataResponse(response:GystEntryResponseSuccess) {
    const new_entries_total = response.gyst_entries.length

    if(this.data.uses_setting_value) {
      this.callSettingValueUpdateStatus(response)

      const is_all_loaded = this.getSettingValueStatusComponents().every(setting_value => setting_value.is_loading == false)
      if(is_all_loaded) {
        this.is_loading = false
      }
    }
    else {
      this.pagination_data = response.pagination_data
      this.is_loading = false
    }

    this.total_loaded += new_entries_total
  }

  handleErrorResponse(response:GystEntryResponseError) {
    if(response.error.name == "NO_SETTING_VALUES") {
      this.error = response.error
      /**
       * 2020-03-21 20:42
       * 
       * Not calling for obvious reason. NO_SETTING_VALUES. There is no setting value.
       */
      // this.callSettingValueUpdateStatus(response)
      this.is_loading = false
    }
    else if(response.error.name == "OAUTH_CONNECTED_USER_NOT_EXIST") {
      this.callSettingValueUpdateStatus(response)
      this.error = response.error
      this.is_loading = false
    }
    else if(response.error.name == "INVALID_SETTING_VALUE") {
      this.callSettingValueUpdateStatus(response)
      this.is_loading = false
    }
    else if(response.error.name == "ERROR_ON_REFRESH_TOKEN") {
      this.error = response.error
      this.is_loading = false
    }
    else if(response.error.name == "DEV_FAULT") {
      this.callSettingValueUpdateStatus(response)
      this.error = response.error
      this.is_loading = false
    }
  }

  isAllLoaded() {
    const result = this.getSettingValueStatusComponents().every(setting_value => setting_value.is_loading == false)
    return result
  }

  getSettingValueStatusComponents() {
    let components = (<SettingValueStatus[]> this.$refs["setting-value-status"])
    if(components == undefined) {
      components = []
    }
    return components
  }
}
</script>