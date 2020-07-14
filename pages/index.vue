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

  div.pagination-container(:style="{ height: '350px'}" ref="pagination-container")
    div.pagination-waiting-container(
      v-show="loader.isAllLoaded() == false"
    )
      v-btn.cancel-pagination-button(
        @click="onCancelPaginationClick"
      ) Cancel
      v-progress-circular(indeterminate size=80)

    div.pagination-idle-container(
      v-show="loader.isAllLoaded()"
      ref="pagination-idle-container"
    )
      span Scroll to the bottom to load more entries or click
      v-btn.ml-2.manual-pagination-button(
        :disabled="isLoadStatusEmpty()"
        @click="onClickLoadMore"
      ) Load more
</template>

<script lang="ts">
import { Vue, Component, Prop, getModule, State, Getter, Mutation } from "nuxt-property-decorator"
import io from "socket.io-client"

import GystEntryWrapper from "~/components/common/gyst-entry-loader/GystEntryWrapper.vue"
import GystEntryLoadStatus from "~/components/common/gyst-entry-load-status/GystEntryLoadStatus.vue"

import LoaderStore from "~/store/loader.ts"
import { Loader } from "~/src/cli/store/loader"

import { isGeneralError } from "~/src/cli/gyst-entry-response"
import * as RssStorage from "~/src/cli/store/loader/rss-indexeddb"

// Types
import {
  LoadedEntries,
  LoadStatusServiceSetting,
  LoadStatusSettingValue,
  GystEntryResponseGeneralError,
  GystEntryResponse,
  GystEntryResponseSuccess,
  GystEntryResponseError,
  SuiteEntry,
  SuiteEntryIdObject,
  ServicePaginationReqParam,
  PaginationData,
} from "~/src/common/types/pages/main"
import { WarningName, WarningObject } from "~/src/common/types/common/warning-error"
import { ALL_LOADED } from "../src/common/warning-error"

@Component({
  components: { GystEntryLoadStatus, GystEntryWrapper }
})
export default class IndexPage extends Vue {
  loader:Loader = new Loader(this.$store)

  socket:SocketIOClient.Socket = <any> null

  drawer = true
  is_waiting_request:boolean = false

  // Vuex
  @State(state => state["session"].is_logged_in) is_logged_in!:boolean
  @State(state => state["loader"].loaded_entries) loaded_entries!:LoadedEntries
  @Getter("loader/isLoadStatusEmpty") isLoadStatusEmpty!:Function

  mounted() {
    this.asyncMounted()
  }

  onSidePanel() {
    this.drawer = ! this.drawer
  }

  async asyncMounted() {
    // Fired from `layouts/default`
    document.addEventListener("side-panel", this.onSidePanel)

    this.setPaginationOnScroll()
    this.setupClientSocket()

    if(this.is_logged_in) {
      if(this.isLoadStatusEmpty()) {
        return
      }

      this.loader.startInitRequest()
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
    this.socket.on(`gyst-entries-pagination-response`, this.onGystPaginationEntries)
    this.socket.on(`gyst-entries-init-error`, this.onGystInitError)
    this.socket.on(`gyst-entries-pagination-error`, this.onGystPaginationError)
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

  /**
   * Same behavior as when clicking on the "load more" button at the bottom
   */
  async onScrolledToBottom() {
    /**
     * 2020-06-15 16:45
     * Case for clicking is handled in the template `:disabled`.
     */
    this.loadMore()
  }

  async onCancelPaginationClick() {
    this.is_waiting_request = false;
  }

  /**
   * Same behavior as when scrolling to the bottom
   */
  onClickLoadMore() {
    this.loadMore()
  }

  isAtBottom() {
    return (window.innerHeight + window.pageYOffset) >= document.body.offsetHeight
  }

  updateIsWaitingRequest() {
    const is_all_loaded = this.loader.isAllLoaded()
    if(is_all_loaded) {
      this.is_waiting_request = false
    }
  }

  async loadMore() {
    this.loader.loadEntries()
    const all_params = await this.loader.suggestAllPaginationParams()
    const pagination_req_params = all_params.filter(suggestion => suggestion.suggested)
      .map(entry => entry.pagination_req_param!)
    this.requestPagination(pagination_req_params)
  }

  async onGystInitEntries(response:GystEntryResponseSuccess) {
    await this.handleSocketResponse(response)
  }

  async onGystPaginationEntries(response:GystEntryResponseSuccess) {
    await this.handleSocketResponse(response)
  }

  async onGystInitError(response:GystEntryResponseError) {
    await this.handleSocketResponseError(response)
  }

  async onGystPaginationError(response:GystEntryResponseError) {
    await this.handleSocketResponseError(response)
  }

  /**
   * 2020-07-04 06:29
   * Hard coded with loading 'old' entries only
   */
  requestPagination(params:ServicePaginationReqParam[]) {
    const DIRECTION = "old"

    if(params.length > 0) {
      this.socket!.emit(`gyst-entries-pagination`, { direction: DIRECTION, pagination_req_data: params })
    }
  }

  async handleSocketResponse(response:GystEntryResponseSuccess) {
    await this.loader.storeResponse(response)

    /**
     * 2020-06-09 09:29
     * 
     * Always concat to preloaded storage, but when the user opened the app (visit the page)
     * for the first time, or the users is at the bottom of the page, load into 'loaded
     * storage' directly.
     */
    if(this.loader.isNonLoaded() || this.isAtBottom()) {
      this.loader.loadEntries()
    }

    const suggestion = await this.loader.suggestPaginationParam(response)

    if(suggestion.suggested) {
      this.requestPagination([suggestion.pagination_req_param!])
    }
  }

  handleSocketResponseError(response:GystEntryResponseError) {
    this.loader.storeError(response)
  }
}
</script>
