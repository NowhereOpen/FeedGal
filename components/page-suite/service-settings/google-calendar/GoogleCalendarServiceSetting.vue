<template lang="pug">
div
  ServiceSetting(
    :service-setting="serviceSetting"
    @disconnect="$emit('disconnect', $event)"
    v-on="$listeners"
    @editor-open="onEditorOpen"
  )
    template(v-slot:editor-body="{ editor }")
      div(v-if="is_loaded")
        v-select.region-field(
          v-model="editor.value"
          label="Choose calendar"
          :items="calendars"
          item-text="summary"
          :item-value="getCalendarItemValue"
          :error-messages="error_message == null ? [] : error_message"
        )
      div(v-else)
        v-progress-circular(v-if="is_loading" indeterminate size=20)

    template(v-slot:setting-value="{ setting_value: { value } }")
      //- MAY need to refactor this into its own component
      div.calendar-name-container
        div(v-if="value.summary == undefined")
          v-tooltip(bottom)
            template(v-slot:activator="{ on }")
              div.red--text(
                v-on="on"
              ) {{ value.summary }}
            div The calendar with this id does not exist.
        div(v-else) {{ value.summary }}
</template>

<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator"
import _ from "lodash"

import * as requestMaker from "~/src/cli/request-maker"
import { GOOGLE_AUTHORIZATION_ERROR } from "~/src/common/warning-error"

// Components
import ServiceSetting from "../basic/ServiceSetting.vue"

// Types
import { ServiceSetting as ServiceSettingType } from "~/src/common/types/pages/suite"

@Component({
  components: { ServiceSetting }
})
export default class GoogleCalendarServiceSetting extends ServiceSetting {
  @Prop() serviceSetting!:ServiceSettingType

  error_message:string|null = null

  is_loaded = false
  is_loading = false

  calendars:any[] = []

  mounted() {
    this.asyncMounted()
  }

  async asyncMounted() {
    if(this.serviceSetting.oauth_info!.is_connected == false) {
      return
    }
  }

  /**
   * 2020-06-17 04:39 
   * 
   * Use this to get the "calendar name", the 'summary' field in the calendar object from google
   * calendar API because the setting value will be an email form value.
   */
  getCalendarNameFromId(calendar_id:string) {
    let target_calendar = this.calendars.find(entry => entry.id == calendar_id)

    if(target_calendar == undefined) {
      /**
       * Case where id == "primary" OR, it just happens that the calendar doesn't exist
       * anymore.
       */
      return undefined
    }
    else {
      return target_calendar.summary
    }
  }

  getCalendarItemValue(calendar:any) {
    return {
      id: calendar.id,
      summary: calendar.summary
    }
  }

  async onEditorOpen() {
    /**
     * 2020-06-21 09:27 
     * 
     * Expect the user to refresh the page if the page doesn't load calendars 'properly'
     * after the user has made changed to one's google calendar while on this page.
     */
    if(this.is_loaded) return

    this.is_loading = true
    await this.loadCalendars()
    this.is_loading = false
    this.is_loaded = true
  }

  async loadCalendars() {
    const { data } = await requestMaker.settings.gyst_suites.getGoogleCalendars(this.serviceSetting._id)
    if(Array.isArray(data)) {
      this.calendars = data
      this.error_message = null
    }
    else {
      if(_.get(data, "error.name") == GOOGLE_AUTHORIZATION_ERROR.name) {
        this.error_message = data.message
      }
    }
  }
}
</script>