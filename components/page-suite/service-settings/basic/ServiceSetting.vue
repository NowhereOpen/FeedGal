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

    v-card-actions.actions-container(
      :data-is-visible="isActionsVisible()"
    )
      div.actions(v-if="isActionsVisible()")
        ToggleServiceCheckbox(
          ref="toggle-service-checkbox"
          :is-disabled="serviceSetting.is_disabled"
          @change="onToggleServiceChange"
        )
</template>

<script lang="ts">
import * as _ from "lodash"
import { AxiosError } from "axios"
import { Component, Vue, Prop, Mutation } from "nuxt-property-decorator"
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import * as requestMaker from "~/src/cli/request-maker"

import ServiceInfo from "../../service-setting-components/ServiceInfo.vue"
// import ConnectOAuthBtn from "../../service-setting-components/ConnectOAuthBtn.vue"
// import DisconnectOAuth from "../../service-setting-components/DisconnectOAuth.vue"
import SettingValueEditor from "../../service-setting-components/SettingValueEditor.vue"
import SettingValueContainer from "../../service-setting-components/SettingValueContainer.vue"
import ToggleServiceCheckbox from "../../service-setting-components/ToggleServiceCheckbox.vue"

import { ServiceSetting, SettingValue, OAuthUserInfo } from "~/src/common/types/gyst-suite"
import { ServiceInfo as ServiceInfoType } from "~/src/common/types/service-info"

@Component({
  components: {
    ServiceInfo,
    SettingValueEditor,
    SettingValueContainer,
    ToggleServiceCheckbox,
  }
})
export default class ServiceSettingComp extends Vue {
  @Prop() serviceSetting!:ServiceSetting

  // Used by "sub component" like `LeagueOfLegendsServiceSetting`
  @Prop() editorDefaultValue:any

  @Mutation("page-suite/setIsDisabled") setIsDisabled!:Function
  @Mutation("page-suite/addNewSettingValue") addNewSettingValue!:Function
  @Mutation("page-suite/updateSettingValue") updateSettingValue!:Function
  @Mutation("page-suite/deleteSettingValue") deleteSettingValue!:Function

  confirm_remove = false

  setIsEditing(value:boolean) {
    this.$emit("editor-open")
    ;(<SettingValueContainer> this.$refs["setting-value-container"]).setIsEditing(value)
  }

  getConnectedUsers() {
    const service_id = this.serviceSetting.service_id
    const service_info = (<ServiceInfoType []> <any> this.$attrs.service_infos).find(entry => entry.service_id == service_id)
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
      return this.serviceSetting.oauth_info!.is_connected && this.serviceSetting.uses_setting_value
    }
    else {
      return this.serviceSetting.uses_setting_value
    }
  }

  async onSaveEditor(setting_value_id:string|null, new_value:any) {
    const is_new = setting_value_id == null

    let response!:any

    try {
      if(is_new) {
        response = await requestMaker.settings.gyst_suites.addNewSettingValue(
          this.serviceSetting._id,
          {
            value: new_value,
            service_id: this.serviceSetting.service_id
          }
        )
      }
      else {
        response = await requestMaker.settings.gyst_suites.updateSettingValue(
          this.serviceSetting._id,
          <string> setting_value_id,
          {
            value: new_value,
            service_id: this.serviceSetting.service_id 
          }
        )
      }
    }
    catch(e) {
      if('response' in e && 'data' in e.response && (<AxiosError> e).response!.status == 400 && e.response.data.error.name == "SETTING_VALUE_VALIDATION_ERROR") {
        const error_data:ValidationResult = e.response.data.error.data
        if(error_data.is_valid === false) {
          ;(<SettingValueEditor> this.$refs["editor"]).setEditorError(error_data.error_message!)
          return
        }
      }

      throw e
    }

    const res_data:any = response.data

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

  async onToggleServiceChange(new_value:boolean) {
    const service_id:string = this.serviceSetting.service_id
    const service_setting_id:string = this.serviceSetting._id
    ;(<ToggleServiceCheckbox>this.$refs["toggle-service-checkbox"]).setIsWaiting(true)
    
    const { data } = await requestMaker.settings.gyst_suites.toggleService(service_setting_id)
    const disabled = data.result
    this.setIsDisabled({ service_setting: this.serviceSetting, disabled })

    ;(<ToggleServiceCheckbox>this.$refs["toggle-service-checkbox"]).setIsWaiting(false)
  }

  async onDeleteSettingValue(setting_value_id:string) {
    const { data } = await requestMaker.settings.gyst_suites.deleteSettingValue(setting_value_id)
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
    ;(<Vue> (<any> this.$root).service_setting_event_bus).$emit("remove-service-setting", this.serviceSetting._id)
  }
}
</script>