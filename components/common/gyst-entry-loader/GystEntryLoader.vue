<template lang="pug">
div
  v-navigation-drawer(
    v-if="sidePanel"
    v-model="drawer"
    :mini-variant="false"
    :clipped="true"
    fixed
    mobile-break-point=0
    app
  )
    div.pa-2
      slot(name="side-panel")
        div Targets (Enabled and filterable stuff)
        //-
          2020-02-10 08:40

          I think the loading "status" is only relevant for the "gyst entries" that are
          loaded from other services because the amount of time it takes for entries from
          each and all services to load is really reliant on performance of their servers
          and not ours.

          On the other hand, the amount of time it takes to load gyst cummunities and
          topics are reliant on our server.
        div Target status

  slot(name="header")

  div
    div(v-for="gyst_entry_wrapper of loaded_gyst_entry_wrappers")
      GystEntryWrapper(
        :gyst-entry-wrapper="gyst_entry_wrapper"
      )

  Pagination(
    ref="pagination"
    @bottom="onBottom"
    @load-more="onLoadMore"
  )
</template>

<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator"
import * as _ from "lodash"
import moment from "moment"

import * as requestMaker from "~/src/cli/request-maker"
import {
  GystEntryResponseGeneralError,
  ArrPaginationReqData,
  PaginationData,
  GystEntryResponse,
  GystEntryResponseSuccess,
  GystEntryPaginationResponse,
  GystEntryPaginationResponseSuccess,
  PaginationReqData
} from "~/src/common/types/gyst-entry"
import { GystEntryWrapper as GystEntryWrapperType } from "~/src/cli/types/gyst-entry"

import { OnGystEntriesPostCb, GystEntryWSClient } from "~/src/cli/ws-client/lib/gyst-entry"

import Pagination from "./Pagination.vue"
import GystEntryWrapper from "./GystEntryWrapper.vue"

@Component({
  components: { Pagination, GystEntryWrapper }
})
export default class GystEntryLoader extends Vue {
  @Prop({ default: false }) sidePanel!:boolean
  drawer = true

  /**
   * Loaded and added to loaders. Receives entries from `preloaded_gyst_entry_wrappers`
   */
  loaded_gyst_entry_wrappers:GystEntryWrapperType[] = []
  /**
   * Received response but waiting 
   */
  preloaded_gyst_entry_wrappers:GystEntryWrapperType[] = []

  gyst_loader:GystEntryWSClient = <any> null

  pagination_data:ArrPaginationReqData = []

  waiting_all_pagination = false

  mounted() {
    // Fired from `layouts/default`
    document.addEventListener("side-panel", this.onSidePanel)

    this.setupWSClient()
  }

  async asyncMounted() {}

  onSidePanel() {
    this.drawer = ! this.drawer
  }

  /**
   * 2020-03-14 14:28
   * Note that GystEntryLoader is used for loading other gyst entries from Topics,
   * communities, etc.
   * 
   * So, the PAGES need to control the `GystEntryLoader` so that the page loads
   * what it needs.
   */
  loadInitGystEntries() {
    this.gyst_loader.loadInitEntries()
    this.setWaitingAllPagination(true)
  }

  clearLoader() {
    this.loaded_gyst_entry_wrappers.splice(0)
    this.pagination_data.splice(0)
  }

  setupWSClient() {
    this.gyst_loader = new GystEntryWSClient("gyst-entries")
    /**
     * 2020-05-24 18:56 
     * 
     * Define and assign the loader component's methods for readability.
     */
    this.gyst_loader.onGystInitEntriesPostCb = this.onGystInitEntries.bind(this)
    this.gyst_loader.onGystPaginationEntriesPostCb = this.onGystPaginationEntries.bind(this)
    this.gyst_loader.setup()
  }

  loadFromPreloadedStorage() {
    const entries = this.preloaded_gyst_entry_wrappers.splice(0, 10)
    this.loaded_gyst_entry_wrappers = this.loaded_gyst_entry_wrappers.concat(entries)
  }

  concatToPreloadedStorage(response:GystEntryResponseSuccess) {
    const entries = this.gystEntriesFromResponse(response)
    this.preloaded_gyst_entry_wrappers = this.preloaded_gyst_entry_wrappers.concat(entries)
    
    // Sort entries in chronological order
    this.preloaded_gyst_entry_wrappers.sort((a,b) => moment(b.entry.datetime_info).isAfter(moment(a.entry.datetime_info)) ? 1 : -1)
  }

  async onGystInitEntries(response:GystEntryResponse) {
    if("error" in response && response.error.name == "NO_SERVICE_SETTINGS") {
    
    }
    else {
      this.$emit("loaded", response)
      this.concatToPreloadedStorage(<GystEntryResponseSuccess> response)

      this.gyst_loader.pagination_data_storage.loadWithInit(response)

      if(this.loaded_gyst_entry_wrappers.length > 0) {
        return
      }
      else {
        this.loadFromPreloadedStorage()
      }
    }
  }

  async onGystPaginationEntries(response:GystEntryPaginationResponse) {
    if("error" in response) {

    }
    else {
      this.$emit("loaded", response)
      const is_load_race = this.preloaded_gyst_entry_wrappers.length == 0
      this.concatToPreloadedStorage(<GystEntryResponseSuccess> response)
      this.gyst_loader.pagination_data_storage.loadWithPagination(response)

      if(is_load_race) {
        this.loadFromPreloadedStorage()
      }
    }
  }
  
  async onBottom() {
    this.handleHitBottom()
  }

  async onLoadMore() {
    this.handleHitBottom()
  }

  handleHitBottom() {
    const is_preloaded_empty = this.preloaded_gyst_entry_wrappers.length == 0

    /**
     * Not waiting, so trigger stuff that requires waiting.
     */
    if(this.waiting_all_pagination == false && is_preloaded_empty) {
      this.gyst_loader.loadEntriesWithPagination("old")
      this.setWaitingAllPagination(true)
      this.$emit("load-pagination-gyst-entry")
    }
    else {
      this.loadFromPreloadedStorage()
    }
  }

  setWaitingAllPagination(value:boolean) {
    this.waiting_all_pagination = value

    ;(<Pagination> this.$refs["pagination"]).setIsWaitingPagination(value)
  }

  gystEntriesFromResponse(response:GystEntryResponse) {
    if("error" in response) return [];

    const entries = (<GystEntryResponseSuccess>response).entries
    const wrapper_entries = entries.map(entry => (<GystEntryWrapperType> {
      pagination_index: response.pagination_data.index,
      entry
    }))

    return wrapper_entries
  }
}
</script>