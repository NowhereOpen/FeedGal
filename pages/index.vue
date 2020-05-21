<template lang="pug">
div
  GystEntryLoader(
    :side-panel="true"
    ref="gyst-entry-loader"
    @loaded="onGystEntriesLoaded"
    @load-pagination-gyst-entry="onLoadPaginationGystEntry"
  )
    template(#side-panel)
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

import GystEntryLoader from "~/components/common/gyst-entry-loader/GystEntryLoader.vue"
import Pagination from "~/components/common/gyst-entry-loader/Pagination.vue"
import GystEntryLoadStatus from "~/components/common/gyst-entry-load-status/GystEntryLoadStatus.vue"

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
  selected_gyst_suite:GystSuite = <any> null

  controller:any = {
    is_loading: false,
    pagination: null
  }

  mounted() {
    this.asyncMounted()
  }

  async asyncMounted() {
    ;(<GystEntryLoadStatus> this.$refs["gyst-entry-load-status"]).startLoading()    
    ;(<GystEntryLoader> this.$refs["gyst-entry-loader"]).loadInitGystEntries()
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

  onGystEntriesLoaded(response:GystEntryResponse) {
    this.updateLoadStatus(response)
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
