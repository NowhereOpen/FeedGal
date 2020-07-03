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
        :disabled="isLoadStatusEmpty()"
        @click="onClickLoadMore"
      ) Load more
</template>

<script lang="ts">
import { Vue, Component, Prop, getModule, State, Getter, Mutation } from "nuxt-property-decorator"
import io from "socket.io-client"

import GystEntryWrapper from "~/components/common/gyst-entry-loader/GystEntryWrapper.vue"
import GystEntryLoadStatus from "~/components/common/gyst-entry-load-status/GystEntryLoadStatus.vue"

import Loader from "~/store/loader.ts"

import * as requestMaker from "~/src/cli/request-maker"
import { isGeneralError } from "~/src/cli/gyst-entry-response"

// Types
import {
  LoadedEntries,
  LoadStatusServiceSetting,
  LoadStatusSettingValue,
  GystEntryResponseGeneralError,
  GystEntryResponse,
  GystEntryResponseSuccess,
  LoadEntryParam,
  ServicePaginationReqParam,
} from "~/src/common/types/pages/main"

@Component({
  components: { GystEntryLoadStatus, GystEntryWrapper }
})
export default class IndexPage extends Vue {
  @State(state => state["session"].is_logged_in) is_logged_in!:boolean
  @State(state => state["loader"].loaded_entries) loaded_entries!:LoadedEntries
  @Getter("loader/isLoadStatusEmpty") isLoadStatusEmpty!:Function

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
      if(this.loader.isLoadStatusEmpty()) {
        return
      }

      this.loader.startLoading()
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

  updateIsWaitingRequest(response:GystEntryResponse) {
    this.loader.updateStatus(response)
    // ;(<GystEntryLoadStatus> this.$refs["gyst-entry-load-status"]).updateStatus(response)
    const is_all_loaded = this.loader.isAllLoaded()
    if(is_all_loaded) {
      this.is_waiting_request = false
    }
  }

  loadMore() {
    this.loader.loadFromPreloadedStorage()

    const all_params = this.getAllLoadEntryParams()
      .filter(param => {
        const load_entry_param = this.loader.getParam(param)
        
        const error_exists = "error" in load_entry_param
        const all_loaded_warning = "warning" in load_entry_param && load_entry_param.warning!.name == "ALL_LOADED"
        const is_enough_loaded = this.loader.isEnoughPreloaded(param)

        return error_exists == false && is_enough_loaded == false && all_loaded_warning == false
      })

    this.requestPagination(all_params)
  }

  async onGystInitEntries(response:GystEntryResponse) {
    this.handleSocketResponse(response)
  }

  async onGystPaginationEntries(response:GystEntryResponse) {
    this.handleSocketResponse(response)
  }

  getAllLoadEntryParams() {
    const output:LoadEntryParam[] = []
    this.loader.load_status.forEach(service_setting => {
      const service_setting_id = service_setting._id
      if(service_setting.uses_setting_value) {
        service_setting.setting_values.forEach(setting_value => {
          const setting_value_id = setting_value._id
          output.push({ service_setting_id, setting_value_id })
        })
      }
      else {
        output.push({ service_setting_id })
      }
    })

    return output
  }

  /**
   * 2020-07-04 06:29
   * Hard coded with loading 'old' entries only
   */
  requestPagination(params:LoadEntryParam[]) {
    const DIRECTION = "old"
    const pagination_req_data:ServicePaginationReqParam[] = []
    
    params.forEach(param => {
      const data = this.loader.getPaginationReqDataForLoadEntryParam(param)
      pagination_req_data.push(data)

      this.loader.updateIsLoading({ param, value: true })
    })

    this.socket!.emit(`gyst-entries-pagination`, { direction: DIRECTION, pagination_req_data })
  }

  handleSocketResponse(response:GystEntryResponse) {
    this.loader.updatePaginationReqData(response)
    this.updateIsWaitingRequest(response)

    if("error" in response == false) {
      this.loader.concatToPreloadedStorage(<GystEntryResponseSuccess> response)
      /**
       * 2020-06-09 09:29
       * 
       * Always concat to preloaded storage, but when the user opened the app (visit the page)
       * for the first time, or the users is at the bottom of the page, load into 'loaded
       * storage' directly.
       */
      if(this.loader.isLoadedEmpty || this.isAtBottom()) {
        this.loader.loadFromPreloadedStorage()
      }
    }

    /**
     * 2020-06-09 10:08
     * 
     * Don't request for next pagination when there is `RATE_LIMIT` warning because it will result in
     * somewhat 'endless loop' of making request and resposne with `RATE_LIMIT` warning until the
     * outside service finally returns a proper response or some error/warning that is not converted
     * into `RATE_LIMIT` by the gyst server.
     */
    const rate_limit_warning = "warning" in response && response.warning!.name == "RATE_LIMIT"
    const all_loaded_warning = "warning" in response && response.warning!.name == "ALL_LOADED"
    const error_exists = "error" in response
    const is_enough_loaded = this.loader.isEnoughPreloaded(<LoadEntryParam> response)
    const count_loaded_entries = "entries" in response ? response.entries.length : 0
    if(count_loaded_entries == 0 || is_enough_loaded || rate_limit_warning || error_exists || all_loaded_warning) {
      return
    }

    this.requestPagination([{ service_setting_id: response.service_setting_id, setting_value_id: response.setting_value_id }])
  }
}
</script>
