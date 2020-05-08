<template lang="pug">
div
  GystEntryLoader(
    :side-panel="true"
    ref="gyst-entry-loader"
    @loaded="onGystEntriesLoaded"
    @load-pagination-gyst-entry="onLoadPaginationGystEntry"
  )
    template(#side-panel)
      v-select(
        label="Gyst Suite"
        v-model="selected_gyst_suite_id"
        :items="gyst_suites"
        item-text="gyst_suite_name"
        item-value="_id"
        @change="onGystSuiteChange"
      )
      v-btn(@click="writePost") Write a post
      v-btn() Sort
      v-checkbox(
        label="Collapse old entries"
      )
      div.mt-2
        GystEntryLoadStatus(
          ref="gyst-entry-load-status"
        )
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator"

import GystEntryLoader from "../common/gyst-entry-loader/GystEntryLoader.vue"
import Pagination from "../common/gyst-entry-loader/Pagination.vue"
import GystEntryLoadStatus from "../common/gyst-entry-load-status/GystEntryLoadStatus.vue"

import { GystSuite, ServiceSetting } from "~/src/common/types/gyst-suite"
import {
  GystEntryResponse,
  GystEntryPaginationResponse,
  ServicesPaginationReqData,
  PaginationData
} from "~/src/common/types/gyst-entry"

import { OnGystEntriesPostCb } from "~/src/cli/ws-client/lib/gyst-entry"
import * as requestMaker from "~/src/cli/request-maker"

@Component({
  components: { GystEntryLoader, GystEntryLoadStatus }
})
export default class IndexPage extends Vue {
  // Injected on server side
  gyst_suites:GystSuite[] = []
  service_settings:ServiceSetting[] = []

  selected_gyst_suite:GystSuite = <any> null
  selected_gyst_suite_id:string = ""

  controller:any = {
    is_loading: false,
    pagination: null
  }

  mounted() {
    this.asyncMounted()
  }

  async asyncMounted() {
    this.selectDefaultGystEntry()
    
    ;(<GystEntryLoadStatus> this.$refs["gyst-entry-load-status"]).loadLoadStatus(this.service_settings)
    this.$nextTick(() => {
      ;(<GystEntryLoadStatus> this.$refs["gyst-entry-load-status"]).startLoading()
    })
    
    ;(<GystEntryLoader> this.$refs["gyst-entry-loader"]).loadInitGystEntries()
  }

  selectDefaultGystEntry() {
    const default_gyst_entry = this.gyst_suites.find(entry => entry.is_default)
    
    if(default_gyst_entry != null) {
      this.selected_gyst_suite_id = default_gyst_entry._id
      this.selected_gyst_suite = default_gyst_entry
    }
  }

  writePost() {
    alert("Open post editor")
  }

  getLoadingMessage() {
    let message = "Loading "
    if(this.controller.pagination == "new") {
      message += "new entries"
    }
    else if(this.controller.pagination == "old") {
      message += "old entries"
    }

    message += " ..."
    return message
  }

  loadNewEntries() {
    this.controller.is_loading = true
    this.controller.pagination = "new"
  }

  loadOldEntries() {
    this.controller.is_loading = true
    this.controller.pagination = "old"
  }

  resetController() {
    this.controller.is_loading = false
    this.controller.pagination = null
  }

  async onGystSuiteChange(gyst_suite_id:any) {
    const { data } = await requestMaker.settings.gyst_suites.getGystSuiteServiceSettings(gyst_suite_id)

    ;(<GystEntryLoadStatus> this.$refs["gyst-entry-load-status"]).resetLoadStatus()
    /**
     * 2020-03-17 23:19
     * 
     * First next tick required so that when the changed gyst suite has shared service setting, its
     * data is reset. Eg, total loaded is 0.
     */
    await this.$nextTick()
    ;(<GystEntryLoadStatus> this.$refs["gyst-entry-load-status"]).loadLoadStatus(data.service_settings)
    /**
     * 2020-03-17 23:20
     * 
     * Second next tick required to use `v-progress-circular` properly.
     */
    await this.$nextTick()
    ;(<GystEntryLoadStatus> this.$refs["gyst-entry-load-status"]).startLoading()

    ;(<GystEntryLoader> this.$refs["gyst-entry-loader"]).clearLoader()
    ;(<GystEntryLoader> this.$refs["gyst-entry-loader"]).loadInitGystEntries(gyst_suite_id)
  }

  onGystEntriesLoaded(cb:OnGystEntriesPostCb, response:GystEntryResponse) {
    if(response.gyst_suite_id != this.selected_gyst_suite_id) {
      console.debug(
        `Response gyst_suite_id (${response.gyst_suite_id}). Currently selected gyst_suite_id: (${this.selected_gyst_suite_id}) mismatch.`,
        `Not loading entries in the response.`
      )
      return
    }

    this.updateLoadStatus(response)

    cb(this.selected_gyst_suite_id, response)
  }

  updateLoadStatus(gyst_response_wrapper:GystEntryResponse) {
    ;(<GystEntryLoadStatus> this.$refs["gyst-entry-load-status"]).updateStatus(gyst_response_wrapper)
    
    const is_all_loaded = (<GystEntryLoadStatus> this.$refs["gyst-entry-load-status"]).isAllLoaded()
    if(is_all_loaded) {
      ;(<Pagination> (<GystEntryLoader> this.$refs["gyst-entry-loader"]).$refs["pagination"]).setIsWaitingPagination(false)
    }
  }

  onLoadPaginationGystEntry() {
    ;(<GystEntryLoadStatus> this.$refs["gyst-entry-load-status"]).startLoading()
  }
}
</script>
