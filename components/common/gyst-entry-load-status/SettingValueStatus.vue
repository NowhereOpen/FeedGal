<template lang="pug">
div
  span {{ data.displayed_as }}
  span.ml-1
    span(v-if="error != null")
      span(v-if="error.name == 'DEV_FAULT'")
        span.error {{ error.message }}
      span(v-else)
        span.warning {{ error.message }}
    span(v-else)
      span ({{ total_loaded }})
      v-progress-circular.ml-2(v-if="is_loading" indeterminate size="20")  
</template>

<script lang="ts">
import { Vue, Component, Prop } from "nuxt-property-decorator"

import {
  GystEntryResponse,
  GystEntryResponseSuccess,
  GystEntryResponseError,
  GystEntryPaginationResponse,
  GystEntryResponseErrorDetails,
  PaginationData
} from "~/src/common/types/gyst-entry"
import { SettingValue } from "~/src/common/types/gyst-suite"
import { Loadable } from "~/src/cli/gyst-entry-load-status/base"

@Component
export default class SettingValueStatus extends Loadable {
  @Prop() data!:SettingValue

  error:GystEntryResponseErrorDetails|null = null
  
  startLoading() {
    if(this.is_error || this.data.is_invalid) {
      return
    }

    this.is_loading = true
  }

  handleDataResponse(response:GystEntryResponseSuccess) {
    const new_entries_total = response.gyst_entries.length

    this.total_loaded += new_entries_total

    this.pagination_data = response.pagination_data
    this.is_loading = false
  }

  handleErrorResponse(response:GystEntryResponseError) {
    this.is_loading = false
    if(response.error.name == "INVALID_SETTING_VALUE") {
      this.error = response.error
    }
  }

  isAllLoaded() {return true}
}
</script>