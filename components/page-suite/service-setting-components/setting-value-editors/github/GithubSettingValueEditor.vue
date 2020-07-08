<template lang="pug">
div
  v-container
    v-row(align="center")
      v-checkbox(
        v-model="value.is_mine"
        :label="value.is_mine ? 'Mine' : undefined"
      )
      v-col(md="2" v-show="value.is_mine == false")
        v-text-field(
          :disabled="value.is_mine"
          v-model="value.owner"
          placeholder="Owner"
        )
      v-col(md="3")
        v-text-field(
          placeholder="Repo name"
          v-model="value.repo"
        )  
</template>

<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator"
import _ from "lodash"

import { SettingValueEditorBase } from "~/src/cli/setting-value-editor/SettingValueEditor"

import { GithubInvalidReason, InvalidReason } from "~/src/common/types/common/setting-value-validation"
import { Github } from "~/src/common/setting-value-validation/validate"
import { GithubSettingValue } from "~/src/common/types/common/setting-value"

// Components
import SettingValueEditor from "../../SettingValueEditor.vue"

// Types
import {
  ServiceSetting
} from "~/src/common/types/pages/suite"

@Component({
  components: { SettingValueEditor }
})
export default class GithubSettingValueEditor extends SettingValueEditorBase<GithubSettingValue> {
  /**
   * 2020-07-07 14:30
   * Accept the whole ServiceSetting type because `!` typescript expresionn is not allowed when binding
   * attributes. I can just use it without using `!` but I want to keep it.
   */
  @Prop() serviceSetting!:ServiceSetting

  value:GithubSettingValue = {
    is_mine: true,
    owner: "",
    repo: "",
    user_id: this.getGithubUserId()
  }

  getGithubUserId() {
    return this.serviceSetting.oauth_info!.user_info!.user_id
  }

  validateBeforeRequestImpl(new_value:GithubSettingValue):GithubInvalidReason|undefined {
    return Github.validate(new_value)
  }

  renderValidationError(invalid_reason:InvalidReason) {
    alert(invalid_reason)
  }
}
</script>