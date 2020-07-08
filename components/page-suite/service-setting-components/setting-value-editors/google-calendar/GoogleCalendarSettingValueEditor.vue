<template lang="pug">
div
  div(v-if="is_loaded")
    v-select.region-field(
      v-model="value"
      label="Choose calendar"
      :items="calendars"
      item-text="summary"
      :item-value="getCalendarItemValue"
      :error-messages="error_message == null ? [] : error_message"
    )
  div(v-else)
    v-progress-circular(v-if="is_loading" indeterminate size=20)
</template>

<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator"
import _ from "lodash"

import * as requestMaker from "~/src/cli/request-maker"

import { GoogleCalendarInvalidReason, InvalidReason } from "~/src/common/types/common/setting-value-validation"
import { GoogleCalendar } from "~/src/common/setting-value-validation/validate"
import { GoogleCalendarSettingValue } from "~/src/common/types/common/setting-value"

import { SettingValueEditorBase } from "~/src/cli/setting-value-editor/SettingValueEditor"

// Types
import { ErrorName } from "~/src/common/types/common/warning-error"

// Components
import SettingValueEditor from "../../SettingValueEditor.vue"

@Component({
  components: { SettingValueEditor }
})
export default class GoogleCalendarSettingValueEditor extends SettingValueEditorBase<GoogleCalendarSettingValue> {
  @Prop() serviceSettingId!:string

  is_loading = false
  /**
   * 2020-07-07 13:08
   * A calendar can be loaded and be empty. `Calendar.length == 0`
   * doesn't mean it's not loaded yet. So need an explicit field
   * that tracks whether the calendar has loaded or not.
   */
  is_loaded = false

  error_message:string|null = null

  value:GoogleCalendarSettingValue = {
    id: "", summary: ""
  }

  calendars:any[] = []

  mounted() {
    this.loadCalendars()
  }

  validateBeforeRequestImpl(new_value:GoogleCalendarSettingValue):GoogleCalendarInvalidReason|undefined {
    return GoogleCalendar.validate(new_value)
  }

  renderValidationError(invalid_reason:InvalidReason) {
    alert(invalid_reason.message)
  }

  getCalendarItemValue(calendar:any) {
    return {
      id: calendar.id,
      summary: calendar.summary
    }
  }

  async loadCalendars() {
    /**
     * 2020-06-21 09:27 
     * 
     * Expect the user to refresh the page if the page doesn't load calendars 'properly'
     * after the user has made changed to one's google calendar while on this page.
     */
    if(this.is_loaded) return

    this.is_loading = true
    await this._loadCalendars()
    this.is_loading = false
    this.is_loaded = true
  }

  async _loadCalendars() {
    const { data } = await requestMaker.settings.suites.getGoogleCalendars(this.serviceSettingId)
    if(Array.isArray(data)) {
      this.calendars = data
      this.error_message = null
    }
    else {
      if(_.get(data, "error.name") == <ErrorName> "GOOGLE_AUTHORIZATION_ERROR") {
        this.error_message = data.message
      }
    }
  }
}
</script>