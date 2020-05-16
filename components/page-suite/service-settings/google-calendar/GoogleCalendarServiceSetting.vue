<template lang="pug">
div
  ServiceSetting(
    :service-setting="serviceSetting"
    @disconnect="$emit('disconnect', $event)"
    v-bind="$attrs"
    v-on="$listeners"
  )
    template(v-slot:editor-body="{ editor }")
      div(v-if="is_loaded")
        v-select.region-field(
          v-model="editor.value"
          label="Choose calendar"
          :items="calendars"
          item-text="summary"
          item-value="id"
        )
      div(v-else)
        v-progress-circular(v-if="is_loading" indeterminate size=20)

    template(v-slot:setting-value="{ value }")
      //- MAY need to refactor this into its own component
      div.calendar-name-container
        div(v-if="calendars.length == 0")
          span
            span Loading calendars
            v-progress-circular.ml-2(indeterminate size=10)
        div(v-else)
          div(v-if="getCalendarNameFromId(value) == undefined")
            v-tooltip(bottom)
              template(v-slot:activator="{ on }")
                div.red--text(
                  v-on="on"
                ) {{ value }}
              div The calendar with this id does not exist.
          div(v-else) {{ getCalendarNameFromId(value) }}
</template>

<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator"

import ServiceSetting from "../basic/ServiceSetting.vue"

import * as requestMaker from "~/src/cli/request-maker"

import { ServiceSetting as ServiceSettingType } from "~/src/common/types/gyst-suite"

@Component({
  components: { ServiceSetting }
})
export default class GoogleCalendarServiceSetting extends ServiceSetting {
  @Prop() serviceSetting!:ServiceSettingType

  is_loading = false
  is_loaded = false
  calendars:any[] = []

  mounted() {
    this.asyncMounted()
  }

  async asyncMounted() {
    if(this.serviceSetting.oauth_info!.is_connected == false) {
      return
    }

    this.is_loading = true

    await this.loadCalendars()

    this.is_loading = false
    this.is_loaded = true
  }

  async loadCalendars() {
    const { data } = await requestMaker.settings.gyst_suites.getGoogleCalendars(this.serviceSetting._id)
    this.calendars = data
  }

  getCalendarNameFromId(id:string) {
    /**
     * 2020-01-21 16:11
     * 
     * When the google calendar service value editor was a text field, I used "primary"
     * as the id of the calendar to add the 'primary' calendar. But now, I can just
     * select the primary calendar from `v-select` and use its actual `id` property as the
     * value. This corresponds to the calendar with `primary: true` key-value pair.
     * 
     * So, no need to check if `calendar.primary == true` because `id` will now all have
     * the same format. No 'special' `"primary"` value.
     */
    let target_calendar = this.calendars.find(entry => entry.id == id)

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
}
</script>