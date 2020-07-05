<template lang="pug">
div
  v-card
    v-card-title Add new service
    v-card-text
      v-select(
        v-model="selected_service_id"
        @change="onChooseService"
        label="Choose service"
        :items="editor_selectables"
        item-value="service_id"
        :item-text="getServiceInfoName"
      )

      //- div Search for service

      div
        div(v-if="isOAuthService()")
          div.connect-status-container
            div(v-if="selected_service.oauth.is_connected == false")
              v-btn(:href="redirectUrl()") Connect service
            div(v-else-if="selected_service.oauth.is_connected == true")
              //-
                2020-03-06 12:09
                user_info_cache.login only works for github. Currently, the model that stores connected oauth user
                does not store user's "friendly id", but only the 'uid'. Need to update the model first before
                changing this.
              v-select(
                :label="'Use other connected ' + selected_service.oauth.service_name  + ' account'"
                :items="selected_service.oauth.oauth_connected_users"
                v-model="selected_oauth_account_id"
                item-value="_id"
                item-text="displayed_account_name"
              )
              div
                span.mr-2 Connect New Account with
                v-btn(:href="redirectUrl()") {{ selected_service.oauth.service_name }}

    v-card-actions
      div
        div
          div.warning(v-if="oauthAccountExists()") A service setting with same oauth account already exists.
          div.warning(v-if="sameServiceIdExists()") A service setting with same service already exists.
        div
          v-tooltip(
            top
            :disabled="isAddNewServiceDisabled() == false"
          )
            template(v-slot:activator="{ on }")
              div(v-on="on")
                v-btn(
                  :disabled="isAddNewServiceDisabled()"
                  @click="onAddNewService"
                ) Add new service
            div {{ isAddNewServiceDisabledMessage() }}
          v-btn(@click="$emit('close')") Close
</template>

<script lang="ts">
import { Prop, Vue, Component, State } from "nuxt-property-decorator"
import _ from "lodash"

import * as requestMaker from "~/src/cli/request-maker"
import { UrlsGystResource } from "~/src/common/urls"

// Types
import { ServiceInfo, ServiceSetting } from "~/src/common/types/pages/suite"

@Component({
  components: {}
})
export default class NewServiceSettingEditor extends Vue {
  @State(state => state['page-suite'].editor_selectables) editor_selectables!:ServiceInfo[]
  @State(state => state["page-suite"].suite_service_settings) suite_service_settings!:ServiceSetting[]

  selected_service_id:string|null = null
  selected_service:ServiceInfo|null = null
  selected_oauth_account_id:string|null = ""

  onChooseService() {
    this.chooseService(this.selected_service_id!)
  }

  /**
   * 2020-06-30 00:52
   * 
   * Used from the outside as well.
   */
  chooseService(service_id:string, oauth_user_entry_id?:string) {
    this.selected_service_id = service_id
    this.selected_service = <ServiceInfo> this.editor_selectables.find(service => service.service_id == this.selected_service_id)

    /**
     * 2020-03-19 23:01
     * 
     * Choose the first account for now. Could have user set a "preferred account" in the future then choose that instead.
     * I just came up with this idea LOL.
     */
    if(this.selected_service.is_oauth && this.selected_service.oauth!.oauth_connected_users.length > 0) {
      if(oauth_user_entry_id) {
        this.selected_oauth_account_id = oauth_user_entry_id
      }
      else {
        this.selected_oauth_account_id = this.selected_service.oauth!.oauth_connected_users[0]._id
      }
    }
    else {
      this.selected_oauth_account_id = null
    }
  }

  isOAuthService() {
    return this.selected_service_id != null && "oauth" in this.selected_service! && this.selected_service!.oauth != undefined
  }

  redirectUrl() {
    return UrlsGystResource.connectNewAccount(this.selected_service!.oauth!.service_id)
  }

  async onAddNewService() {
    const { data } = await requestMaker.settings.gyst_suites.addNewServiceSetting(
      <string> this.selected_service_id,
      <string> this.selected_oauth_account_id
    )

    const service_setting = data.service_setting
    ;(<Vue> (<any> this.$root).service_setting_event_bus).$emit("new-service-setting", service_setting)
  }

  getServiceInfoName(service_info:ServiceInfo) {
    let name = service_info.name

    if(service_info.is_oauth) {
      const connected_users = _.get(service_info, "oauth.oauth_connected_users", [])

      if(connected_users.length > 0) {
        name += ` (${service_info.oauth!.oauth_connected_users.length} ${service_info.oauth!.service_name} Accounts)`
      }
    }

    return name
  }

  isAddNewServiceDisabledMessage():string|undefined {
    let result:string|undefined = undefined

    if(this.selected_service == null) {
      result = "Please select a service"
    }
    else {
      if(this.selected_service.is_oauth) {
        if(this.selected_oauth_account_id == null) {
          result = "Please choose a connected account."
        }
        
        if(this.selected_service.oauth!.oauth_connected_users.length == 0) {
          result = "You must connect some accounts first."
        }
      }
    }

    return result
  }

  isAddNewServiceDisabled() {
    const message = this.isAddNewServiceDisabledMessage()
    
    return message !== undefined
  }

  sameServiceIdExists() {
    const suite_service_settings = this.suite_service_settings
    return suite_service_settings.some(entry => entry.service_id == this.selected_service_id)
  }

  oauthAccountExists() {
    const suite_service_settings = this.suite_service_settings

    const exists = suite_service_settings.some(entry => {
      if(entry.is_oauth && entry.oauth_info!.is_connected) {
        return entry.oauth_info!.user_info!.entry_id == this.selected_oauth_account_id
      }
    })

    return exists
  }
}
</script>