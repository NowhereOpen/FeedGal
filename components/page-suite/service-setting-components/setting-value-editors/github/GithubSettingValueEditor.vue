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

// Components
import SettingValueEditor from "../../SettingValueEditor.vue"

// Types
import {
  ServiceSetting
} from "~/src/common/types/pages/suite"

type EditorValue = {
  is_mine: boolean,
  owner: string,
  repo: string,
  user_id: string
}

@Component({
  components: { SettingValueEditor }
})
export default class GithubSettingValueEditor extends SettingValueEditorBase<EditorValue> {
  /**
   * 2020-07-07 14:30
   * Accept the whole ServiceSetting type because `!` typescript expresionn is not allowed when binding
   * attributes. I can just use it without using `!` but I want to keep it.
   */
  @Prop() serviceSetting!:ServiceSetting

  value:EditorValue = {
    is_mine: true,
    owner: "",
    repo: "",
    user_id: this.getGithubUserId()
  }

  getGithubUserId() {
    return this.serviceSetting.oauth_info!.user_info!.user_id
  }

  validateBeforeRequestImpl(new_value:EditorValue):string|void {
    if(new_value.is_mine && new_value.repo.trim() == "") {
      return "Please enter the repo."
    }

    if(new_value.is_mine == false && [new_value.repo, new_value.owner].some(str_val => str_val.trim() == "")) {
      return "Please fill both the repo name and the owner."
    }
  }

  renderValidationError(invalid_reason:any) {
    alert(invalid_reason)
  }
}
</script>