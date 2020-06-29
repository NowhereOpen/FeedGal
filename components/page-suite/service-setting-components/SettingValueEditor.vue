<template lang="pug">
div.service-setting-editor
  v-btn.new-btn(@click="onNewClick") New
  div.value-editor(v-show="editor.is_open")
    div.value-editor-body
      slot(name="editor-body" :editor="editor")
        v-text-field.editor-field(
          v-model="editor.value"
          :error-messages="getErrorMessage()"
        )
    div.value-editor-actions
      v-btn.cancel(@click="onEditorCancelClick") Cancel
      v-btn.save(
        @click="onEditorSaveClick"
      )
        span Save
        v-progress-circular.ml-2(v-if="is_waiting" indeterminate size="20")
</template>

<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator"
import * as _ from "lodash"
import { AxiosResponse } from "axios"

import { SettingValue } from "~/src/common/types/pages/suite"

@Component
export default class ServiceSettingEditorComp extends Vue {
  @Prop({ default: "" }) defaultValue!:any

  editor:any = {
    setting_value_id: null,
    is_open: false,
    value: null,
    validation: null,
    error: null
  }

  is_waiting = false

  created() {
    this.setEditorDefaultValue()
  }

  getErrorMessage() {
    if(this.editor.error) {
      return this.editor.error
    }
    else {
      return 'Please check the value and try again'
    }
  }

  onEditorCancelClick() {
    this.resetEditor()
    this.$emit("cancel")
  }

  async onEditorSaveClick() {
    this.is_waiting = true
    this.$emit("save", this.editor.setting_value_id, this.editor.value)
  }

  /**
   * Called by the client-code
   */
  setEditorError(error_message:string) {
    this.editor.validation = false
    this.editor.error = error_message
    this.is_waiting = false
  }

  openEditor(setting_value:SettingValue) {
    this.editor.is_open = true
    this.editor.value = setting_value.value
    this.editor.setting_value_id = setting_value._id
  }

  resetEditor() {
    this.editor.is_open = false
    this.setEditorDefaultValue()
    this.editor.setting_value_id = null
    this.editor.error = null
    this.editor.validation = null
    this.is_waiting = false
  }

  setEditorDefaultValue() {
    this.editor.value = _.cloneDeep(this.defaultValue)
  }

  onNewClick() {
    this.editor.is_open = true
    this.setEditorDefaultValue()
    this.$emit("new")
  }
}
</script>