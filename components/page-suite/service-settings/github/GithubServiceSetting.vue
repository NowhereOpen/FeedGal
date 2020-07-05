<template lang="pug">
div
  ServiceSetting(
    ref="ServiceSetting"
    :service-setting="serviceSetting"
    @disconnect="$emit('disconnect', $event)"
    v-on="$listeners"
    :editor-default-value="editor_default_value"
  )
    template(v-slot:editor-body="{ editor }")
      v-container
        v-row(align="center")
          v-checkbox(
            v-model="editor.value.is_mine"
            :label="editor.value.is_mine ? 'Mine' : undefined"
          )
          v-col(md="2" v-show="editor.value.is_mine == false")
            v-text-field(
              :disabled="editor.value.is_mine"
              v-model="editor.value.owner"
              placeholder="Owner"
            )
          v-col(md="3")
            v-text-field(
              placeholder="Repo name"
              v-model="editor.value.repo"
            )
</template>

<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator"
import _ from "lodash"

import * as requestMaker from "~/src/cli/request-maker"

// Components
import ServiceSetting from "../basic/ServiceSetting.vue"

// Types
import { ServiceSetting as ServiceSettingType } from "~/src/common/types/pages/suite"

@Component({
  components: { ServiceSetting }
})
export default class GithubServiceSetting extends ServiceSetting {
  @Prop() serviceSetting!:ServiceSettingType

  editor_default_value = { is_mine:true, owner: "", repo: "", user_id: this.serviceSetting.oauth_info!.user_info!.user_id }
}
</script>