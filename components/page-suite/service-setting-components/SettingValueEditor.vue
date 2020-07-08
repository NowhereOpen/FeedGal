<template lang="pug">
div.service-setting-editor
  div.actions-container
    div(v-if="is_editing == false")
      v-btn.new-btn(
        :disabled="isNewDisabled()"
        @click="onNewClick"
      ) New
    div(v-else)
      v-btn.cancel(@click="onEditorCancelClick") Cancel
      v-btn.save(
        @click="onEditorSaveClick"
      )
        span Save
        v-progress-circular.ml-2(v-if="is_waiting" indeterminate size="20")
  
  div.value-editor(v-if="is_editing")
    GithubSettingValueEditor(
      v-if="serviceSetting.service_id == 'github'"
      ref="GithubSettingValueEditor"
      :service-setting="serviceSetting"
    )
    GoogleCalendarSettingValueEditor(
      v-else-if="serviceSetting.service_id == 'google-calendar'"
      ref="GoogleCalendarSettingValueEditor"
      :service-setting-id="serviceSetting._id"
    )
    LolSettingValueEditor(
      v-else-if="serviceSetting.service_id == 'league-of-legends'"
      ref="LolSettingValueEditor"
    )
</template>

<script lang="ts">
import { Component, Vue, Prop, Mutation } from "nuxt-property-decorator"

import * as requestMaker from "~/src/cli/request-maker"

// Components
import SettingValueEditor from "./SettingValueEditor.vue"
import GithubSettingValueEditor from "./setting-value-editors/github/GithubSettingValueEditor.vue"
import GoogleCalendarSettingValueEditor from "./setting-value-editors/google-calendar/GoogleCalendarSettingValueEditor.vue"
import LolSettingValueEditor from "./setting-value-editors/league-of-legends/LolSettingValueEditor.vue"

// Types
import {
  ServiceSetting,
  SettingValue,
  ValidationResult
} from "~/src/common/types/pages/suite"

// Interface
import { SettingValueEditorBase } from "~/src/cli/setting-value-editor/SettingValueEditor"

@Component({
  components: {
    GithubSettingValueEditor,
    GoogleCalendarSettingValueEditor,
    LolSettingValueEditor,
  }
})
export default class ServiceSettingEditorComp extends Vue {
  @Prop() serviceSetting!:ServiceSetting

  // Vuex Store
  @Mutation("page-suite/addNewSettingValue") addNewSettingValue!:Function
  @Mutation("page-suite/updateSettingValue") updateSettingValue!:Function

  is_editing:boolean = false
  is_waiting = false

  setting_value_id:null|string = null

  public openEditor(setting_value:SettingValue) {
    this.is_editing = true
    this.setting_value_id = setting_value._id

    /**
     * 2020-07-07 14:41
     * 
     * Wait a tick so that `is_editing` renders the editors. Else,
     * `this.getSettingValueEditor` will return undefined becaus
     * it can't find the component.
     */
    this.$nextTick(() => {
      /**
       * Values of services like LoL has data structure. Passing it as it is will be
       * passing by reference and we don't need this for service setting editor.
       */
      const value = setting_value.value
      this.getSettingValueEditor().loadValue(value)
    })
  }

  onNewClick() {
    this.is_editing = true
    this.$emit("new")
  }

  /**
   * 2020-07-07 12:46
   * 
   * Has a specific evaluator when the service setting is oauth. Refer to 2020-07-07 12:31 comment of 
   * `components/page-suite/service-setting-components/SettingValueContainer.vue`
   */
  isNewDisabled() {
    return this.serviceSetting.is_oauth && (this.serviceSetting.oauth_info?.is_connected == false || this.serviceSetting.oauth_info?.user_info?.is_error)
  }

  onEditorCancelClick() {
    this.is_editing = false
    this.$emit("cancel")
  }

  async onEditorSaveClick() {
    const setting_value_editor = this.getSettingValueEditor()
    const new_value = setting_value_editor.value
    const setting_values = this.serviceSetting.setting_values.map(entry => entry.value)
    const validation_before_request = setting_value_editor.validateBeforeRequest(new_value, setting_values)

    if(validation_before_request != null) {
      setting_value_editor.renderValidationError(validation_before_request)
      return
    }

    this.is_waiting = true
    
    const setting_value_id = this.setting_value_id
    const is_new = this.setting_value_id == null

    let response!:any

    if(is_new) {
      response = await requestMaker.settings.suites.addNewSettingValue(
        this.serviceSetting._id,
        new_value
      )
    }
    else {
      response = await requestMaker.settings.suites.updateSettingValue(
        <string> setting_value_id,
        new_value
      )
    }

    const res_data = response.data
    const validation_result:ValidationResult = res_data.validation_result

    if(validation_result.is_valid == false) {
      setting_value_editor.renderValidationError(validation_result.invalid_reason!)
    }
    else {
      const entry:SettingValue = res_data.setting_value

      if(is_new) {
        this.addNewSettingValue({ entry, service_setting: this.serviceSetting })
      }
      else {
        this.updateSettingValue({ entry, service_setting: this.serviceSetting })
      }
      
      this.is_editing = false
      this.$emit("save")
    }

    this.is_waiting = false
  }

  getSettingValueEditor():SettingValueEditorBase<any> {
    const service_id = this.serviceSetting.service_id

    if(service_id == "github") {
      return (<GithubSettingValueEditor> this.$refs["GithubSettingValueEditor"])
    }
    else if(service_id == "google-calendar") {
      return (<GoogleCalendarSettingValueEditor> this.$refs["GoogleCalendarSettingValueEditor"])
    }
    else if(service_id == "league-of-legends") {
      return (<LolSettingValueEditor> this.$refs["LolSettingValueEditor"])
    }
    else {
      console.error(`Dev error. Failed to get setting value editor for service_id (${service_id})`)
      throw Error("Dev error. Failed to get setting value editor.")
    }
  }
}
</script>