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

  Pagination(ref="pagination")
</template>

<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator"
import * as _ from "lodash"

import * as requestMaker from "~/src/cli/request-maker"
import {
  GystEntryResponseGeneralError,
  GystEntryResponseSuccess,
  GystEntryResponseError,
  ServicesPaginationReqData,
  PaginationData,
  GystEntryResponse,
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

  loaded_gyst_entry_wrappers:GystEntryWrapperType[] = []

  gyst_loader:GystEntryWSClient = <any> null

  pagination_data:ServicesPaginationReqData = []

  mounted() {
    // Fired from `layouts/default`
    document.addEventListener("side-panel", this.onSidePanel)

    ;(<Pagination> this.$refs["pagination"]).handlePaginationCb = this.handlePagination

    console.log("gyst entry loader MOUNTED")
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
    console.log("gyst entry loader loadInitGystEntries")
    this.gyst_loader.loadInitEntries()
  }

  clearLoader() {
    this.loaded_gyst_entry_wrappers.splice(0)
    this.pagination_data.splice(0)
  }

  loadGystEntries(response:GystEntryResponseSuccess|GystEntryResponseError) {
    if("error" in response) {
      
    }
    else {
      const gyst_wrappers:GystEntryWrapperType[] = response.entries.map(entry => {
        return <GystEntryWrapperType> {
          pagination_index: response.pagination_data.index,
          entry
        }
      })
      this.loaded_gyst_entry_wrappers = this.loaded_gyst_entry_wrappers.concat(gyst_wrappers)
      console.log(this.loaded_gyst_entry_wrappers)
    }
  }

  setupWSClient() {
    this.gyst_loader = new GystEntryWSClient("gyst-entries")

    // /**
    //  * 2020-04-05 23:26
    //  * 
    //  * Can be little confusing. Using this pattern so that I don't have to repeat using
    //  * `this.$emit("loaded", (gyst_suite_id) => {...})`. I could repeat using it because it's simpler,
    //  * but I want to do it this way.
    //  * 
    //  * The `response` comes from the `onGystEnries` or `onGystEntriesWithPagination`. The `gyst_suite_id`
    //  * is passed from the `loaded` event handler. These to arguments are passed to the `cb`.
    //  */
    // const commonHandler = (cb:OnGystEntriesPostCb) => (response:GystEntryResponse) => {
    //   this.$emit("loaded", (gyst_suite_id:string) => {
    //     cb(response)
    //   }, response)
    // }

    this.gyst_loader.onGystEntriesPostCb = (response:GystEntryResponse) => {
      if("error" in response && response.error.name == "NO_SERVICE_SETTINGS") {
      
      }
      else {
        this.$emit("loaded", response)
        this.loadGystEntries(<GystEntryResponseSuccess|GystEntryResponseError> response)
        this.gyst_loader.pagination_data_storage.loadWithInit(response)
      }
    }

    this.gyst_loader.onGystEntriesWithPaginationPostCb = (response:GystEntryResponse) => {
      this.$emit("loaded", response)
      this.loadGystEntries(<GystEntryResponseSuccess|GystEntryResponseError> response)
      this.gyst_loader.pagination_data_storage.loadWithPagination(response)
    }

    this.gyst_loader.setup()
    console.log("End of setupWSClient")
  }

  async handlePagination() {
    this.gyst_loader.loadEntriesWithPagination("old")
    this.$emit("load-pagination-gyst-entry")
  }
}
</script>