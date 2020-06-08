<template lang="pug">
div
  div.title Load status
  div(
    v-for="service_setting of load_status"
  )
    ServiceSettingStatus(
      ref="service-setting-status"
      :data="service_setting"
    )
</template>

<script lang="ts">
import { Vue, Component, State, Getter } from "nuxt-property-decorator"

import ServiceSettingStatus from "./ServiceSettingStatus.vue"

import {
  GystEntryResponse,
  GystEntryResponseSuccess,
  GystEntryResponseError,
  GystEntryResponseGeneralError,
  PaginationData
} from "~/src/common/types/gyst-entry"
import { LoadStatus } from "~/src/common/types/loader"
import { Loadable } from "~/src/cli/gyst-entry-load-status/base"

@Component({
  components: {
    ServiceSettingStatus
  }
})
export default class GystEntryLoadStatus extends Loadable {
  // @State(state => state['loader'].load_status) load_status!:LoadStatus
  // @Getter("loader/load_status_by_service_setting") load_status_by_service_setting!:LoadStatusByServiceSetting
  @Getter("loader/load_status_by_service_setting") load_status!:LoadStatus

  startLoading() {
    this.getServiceSettingStatusComponents().forEach(comp => {
      comp.startLoading()
    })
  }

  callServiceSettingUpdateStatus(response:GystEntryResponseSuccess|GystEntryResponseError) {
    const service_setting = this.getServiceSettingStatusComponents().find(
      comp => comp.data._id == response.service_setting_id
    )

    /**
     * 2020-03-24 07:43
     * 
     * We call `find` on `getServiceSettingStatusComponents`, which is guaranteed to be an array.
     * But `find` can return undefined. And that is the case for default gyst entry.
     * 
     * Unless default entries get their own load status.
     */
    if(service_setting == undefined) {
      return
    }

    service_setting!.updateStatus(response)
  }

  handleDataResponse(response:GystEntryResponseSuccess) {
    this.callServiceSettingUpdateStatus(response)
  }

  handleErrorResponse(response:GystEntryResponseError) {
    this.callServiceSettingUpdateStatus(response)
  }

  handleGeneralErrorResponse(response:GystEntryResponseGeneralError) {
    alert(response.error.message)
  }

  isAllLoaded() {
    const result = this.getServiceSettingStatusComponents().every(service_setting => service_setting.is_loading == false)
    return result
  }

  getServiceSettingStatusComponents() {
    let components = (<ServiceSettingStatus[]> this.$refs["service-setting-status"])

    if(components == undefined) {
      components = []
    }

    return components
  }
}
</script>