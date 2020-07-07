<template lang="pug">
div.service-setting
  v-card(
    :data-service-setting-id="serviceSetting._id"
    :data-is-oauth="isOAuth()"
  )
    v-card-title
      ServiceInfo(
        :service-setting="serviceSetting"
        :is-oauth="isOAuth()"
      )
      v-spacer
      div
        div(v-if="confirm_remove == false")
          v-btn(
            @click="confirm_remove = true"
          ) Remove
        div(v-else)
          v-btn(
            @click="onRemoveClick"
            color="red"
          ) Remove
          v-btn(
            @click="confirm_remove = false"
          ) Cancel

    v-card-text
      div.service-setting-viewer-container(
        :data-is-setting-visible="isSettingVisible()"
      )
        div.service-setting-viewer(v-if="isSettingVisible()")
          //- div.subtitle-1 {{ serviceSetting.setting.name }}
          
          SettingValueEditor(
            ref="editor"
            :default-value="editorDefaultValue"
            @save="onSaveEditor"
            @new="setIsEditing(true)"
            @cancel="setIsEditing(false)"
          )
            template(v-slot:editor-body="{ editor }")
              slot(name="editor-body" :editor="editor")
          
          SettingValueContainer(
            ref="setting-value-container"
            :service-setting="serviceSetting"
            @delete="onDeleteSettingValue"
            @update="onUpdateSettingValue"
          )
            template(v-slot:setting-value="{ setting_value }")
              slot(name="setting-value" :setting_value="setting_value")
          
      div(v-if="isOAuth() ? ! serviceSetting.oauth_info.is_connected : false")
        span Connect the service first to edit the settings.
</template>

<script lang="ts">
import * as _ from "lodash"
import { AxiosError } from "axios"
import { Component, Vue, Prop, Mutation, State, Action } from "nuxt-property-decorator"
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import * as requestMaker from "~/src/cli/request-maker"

// Components
import ServiceInfo from "../../service-setting-components/ServiceInfo.vue"
import SettingValueEditor from "../../service-setting-components/SettingValueEditor.vue"
import SettingValueContainer from "../../service-setting-components/SettingValueContainer.vue"

// Types
import {
  ServiceSetting,
  SettingValue,
  OAuthUserInfo,
  EditorSelectables,
  ValidationResult
} from "~/src/common/types/pages/suite"

@Component({
  components: {
    ServiceInfo,
    SettingValueEditor,
    SettingValueContainer,
  }
})
export default class ServiceSettingComp extends Vue {
  @Prop() serviceSetting!:ServiceSetting

  // Used by "sub component" like `LeagueOfLegendsServiceSetting`
  @Prop() editorDefaultValue:any

  @State(state => state['page-suite'].editor_selectables) editor_selectables!:EditorSelectables

  @Mutation("page-suite/addNewSettingValue") addNewSettingValue!:Function
  @Mutation("page-suite/updateSettingValue") updateSettingValue!:Function
  @Mutation("page-suite/deleteSettingValue") deleteSettingValue!:Function

  @Action("page-suite/removeServiceSetting") removeServiceSetting!:Function

  confirm_remove = false

  setIsEditing(value:boolean) {
    this.$emit("editor-open")
    ;(<SettingValueContainer> this.$refs["setting-value-container"]).setIsEditing(value)
  }

  getConnectedUsers() {
    const service_id = this.serviceSetting.service_id
    const service_info = this.editor_selectables.find(entry => entry.service_id == service_id)
    return service_info!.oauth!.oauth_connected_users
  }

  isOAuth() {
    return this.serviceSetting.is_oauth
  }

  isActionsVisible() {
    return this.isOAuth() ? this.serviceSetting.oauth_info!.is_connected : true
  }

  /**
   * TODO: 2019-12-10 00:09 This currently results in not displaying the setting name for
   * disconnected oauth. I think showing the setting name would be okay?
   */
  isSettingVisible() {
    if(this.isOAuth()) {
      /**
       * 2020-07-07 10:34
       * 
       * If the service for this service setting uses oauth, check if it's connected because adding
       * new setting values require validating the value, and that requires an access token for the
       * user. If the user is not connected, then there is no way of validating the value either.
       * 
       * As mentioned in the 2019-12-10 00:09 comment above, this results in not showing the setting
       * values even when old setting values exist. I think it's okay to display them. Such case
       * would be users (accidentally) revoking the access from the outside service.
       * 
       * I think this needs to be used for clicking 'new setting value'.
       */
      return this.serviceSetting.oauth_info!.is_connected && this.serviceSetting.uses_setting_value
    }
    else {
      return this.serviceSetting.uses_setting_value
    }
  }

  async onSaveEditor(setting_value_id:string|null, new_value:any) {
    const is_new = setting_value_id == null

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
      ;(<SettingValueEditor> this.$refs["editor"]).setEditorError(validation_result.invalid_reason!)
      return
    }

    const entry:SettingValue = res_data.setting_value

    if(is_new) {
      this.addNewSettingValue({ entry, service_setting: this.serviceSetting })
    }
    else {
      this.updateSettingValue({ entry, service_setting: this.serviceSetting })
    }

    ;(<SettingValueEditor> this.$refs["editor"]).resetEditor()
    ;(<SettingValueContainer> this.$refs["setting-value-container"]).setIsEditing(false)
  }

  async onDeleteSettingValue(setting_value_id:string) {
    const { data } = await requestMaker.settings.suites.deleteSettingValue(setting_value_id)
    this.deleteSettingValue({ service_setting: this.serviceSetting, setting_value_id })
  }

  onUpdateSettingValue(setting_value:any) {
    /**
     * Values of services like LoL has data structure. Passing it as it is will be
     * passing by reference and we don't need this for service setting editor.
     */
    const _setting_value = _.cloneDeep(setting_value)
    ;(<SettingValueEditor>this.$refs["editor"]).openEditor(_setting_value)
  }

  onRemoveClick() {
    this.removeServiceSetting(this.serviceSetting._id)
  }
}
</script>