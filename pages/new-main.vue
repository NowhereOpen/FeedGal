<template lang="pug">
div
  v-navigation-drawer(
    v-if="true"
    v-model="drawer"
    :mini-variant="false"
    :clipped="true"
    fixed
    mobile-break-point=0
    app
  )
    div.pa-2
      GystEntryLoadStatus(
        ref="gyst-entry-load-status"
      )

  div
    div(v-for="gyst_entry_wrapper of loaded_entries")
      GystEntryWrapper(
        :gyst-entry-wrapper="gyst_entry_wrapper"
      )

  div.pagination-container(:style="{ height: '250px'}" ref="pagination-container")
    div.pagination-waiting-container(
      v-show="is_waiting_request"
    )
      v-btn.cancel-pagination-button(
        @click="onCancelPaginationClick"
      ) Cancel
      v-progress-circular(indeterminate size=80)

    div.pagination-idle-container(
      v-show="is_waiting_request == false"
      ref="pagination-idle-container"
    )
      span Scroll to the bottom to load more entries or click
      v-btn.ml-2.manual-pagination-button(
        @click="$emit('load-more')"
      ) Load more
</template>

<script lang="ts">
import { Vue, Component, Prop, getModule, State } from "nuxt-property-decorator"
import io from "socket.io-client"

import GystEntryWrapper from "~/components/common/gyst-entry-loader/GystEntryWrapper.vue"
import GystEntryLoadStatus from "~/components/common/gyst-entry-load-status/GystEntryLoadStatus.vue"

import Loader from "~/store/loader.ts"

import * as requestMaker from "~/src/cli/request-maker"

import {
  GystEntryResponseGeneralError,
  ServicesPaginationReqData,
  PaginationData,
  GystEntryResponse,
  GystEntryResponseSuccess,
  GystEntryPaginationResponse,
  GystEntryPaginationResponseSuccess,
  PaginationReqData
} from "~/src/common/types/gyst-entry"

@Component({
  components: { GystEntryLoadStatus, GystEntryWrapper }
})
export default class IndexPage extends Vue {
  @State(state => state["session"].is_logged_in) is_logged_in!:boolean
  @State(state => state["loader"].loaded_entries) loaded_entries!:any[]
  loader:Loader = <any> null

  socket:SocketIOClient.Socket = <any> null

  drawer = true
  is_waiting_request:boolean = false

  mounted() {
    this.asyncMounted()
  }

  onSidePanel() {
    this.drawer = ! this.drawer
  }

  async asyncMounted() {
    // Fired from `layouts/default`
    document.addEventListener("side-panel", this.onSidePanel)
    
    this.loader = getModule(Loader, this.$store)
    this.setPaginationOnScroll()
    this.setupClientSocket()

    if(this.is_logged_in) {
      ;(<GystEntryLoadStatus> this.$refs["gyst-entry-load-status"]).startLoading()
      this.is_waiting_request = true
      this.socket.emit(`gyst-entries-init`)
    }
    else {
      console.log("Please log in first")
    }
  }

  setupClientSocket() {
    this.socket = io()

    this.socket.on(`gyst-entries-init-response`, this.onGystInitEntries)
    this.socket.on(`gyst-entries-with-pagination-response`, this.onGystPaginationEntries)
  }

  setPaginationOnScroll() {
    window.addEventListener('scroll', () => {
      /**
       * Detect hitting the bottom of the page.
       * 
       * SO post: https://stackoverflow.com/questions/9439725
       */
      if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
        this.onScrolledToBottom()
      }
    });
  }

  async onScrolledToBottom() {
    /**
     * Not waiting, so trigger stuff that requires waiting.
     */
    if(this.is_waiting_request == false && this.loader.isPreloadedEmpty) {
      this.is_waiting_request = true
      const DIRECTION = "old"
      const pagination_req_data = this.loader.getPaginationReqData(DIRECTION)
      this.socket!.emit(`gyst-entries-pagination`, { direction: DIRECTION, pagination_req_data })
    }
    else {
      this.loader.loadFromPreloadedStorage()
    }
  }

  async onCancelPaginationClick() {
    this.is_waiting_request = false;
  }

  updateIsWaitingRequest(response:GystEntryResponse|GystEntryPaginationResponse) {
    ;(<GystEntryLoadStatus> this.$refs["gyst-entry-load-status"]).updateStatus(response)
    const is_all_loaded = (<GystEntryLoadStatus> this.$refs["gyst-entry-load-status"]).isAllLoaded()
    console.log(this.is_waiting_request, is_all_loaded)
    if(is_all_loaded) {
      this.is_waiting_request = false
    }
  }

  async onGystInitEntries(response:GystEntryResponse) {
    if("error" in response && response.error.name == "NO_SERVICE_SETTINGS") {
    
    }
    else {
      this.loader.concatToPreloadedStorage(<GystEntryResponseSuccess> response)
      this.loader.loadWithInit(response)
      this.updateIsWaitingRequest(response)

      if(this.loader.isLoadedEmpty == false) {
        return
      }
      else {
        this.loader.loadFromPreloadedStorage()
      }
    }
  }

  async onGystPaginationEntries(response:GystEntryPaginationResponse) {
    if("error" in response) {

    }
    else {
      this.loader.concatToPreloadedStorage(<GystEntryResponseSuccess> response)
      this.loader.loadWithPagination(response)
      this.updateIsWaitingRequest(response)

      if(this.loader.isPreloadedEmpty) {
        this.loader.loadFromPreloadedStorage()
      }
    }
  }
}
</script>
