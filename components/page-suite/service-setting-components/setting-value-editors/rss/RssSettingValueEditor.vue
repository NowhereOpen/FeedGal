<template lang="pug">
div
  v-text-field(
    v-model="value.url"
    label="RSS URL"
  )
  v-text-field(
    v-model="value.title"
    label="Custom title (Optional. Leave blank to use the default title)"
  )
</template>

<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator"
import _ from "lodash"

import * as requestMaker from "~/src/cli/request-maker"

import { RssInvalidReason, InvalidReason } from "~/src/common/types/common/setting-value-validation"
import { Rss } from "~/src/common/setting-value-validation/validate"
import { RssSettingValue } from "~/src/common/types/common/setting-value"

import { SettingValueEditorBase } from "~/src/cli/setting-value-editor/SettingValueEditor"

// Types
import { ErrorName } from "~/src/common/types/common/warning-error"

// Components
import SettingValueEditor from "../../SettingValueEditor.vue"

@Component({
  components: { SettingValueEditor }
})
export default class RssSettingValueEditor extends SettingValueEditorBase<RssSettingValue> {
  @Prop() serviceSettingId!:string

  value:RssSettingValue = { title:"", original_title:"", url: "" }

  validateBeforeRequestImpl(new_value:RssSettingValue):RssInvalidReason|undefined {
    return Rss.validateValidUrl(new_value)
  }

  renderValidationError(invalid_reason:InvalidReason) {
    alert(invalid_reason.message)
  }
}
</script>