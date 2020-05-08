<template lang="pug">
div.service-setting-editor
  v-btn.new-btn(@click="onNewClick") New
  div.value-editor(v-show="editor.is_open")
    div.value-editor-body
      slot(name="editor-body" :editor="editor")
        v-text-field.editor-field(
          v-model="editor.value"
          :error-messages="['Please check the value and try again']"
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

import * as requestMaker from "~/src/cli/request-maker"

@Component
export default class ServiceSettingEditorComp extends Vue {
  @Prop() serviceId!:string
  @Prop({ default: "" }) defaultValue!:any

  editor:any = {
    is_open: false,
    value: null,
    index: null,
    validation: null,
    error: null
  }

  is_waiting = false

  created() {
    this.setEditorDefaultValue()
  }

  onEditorCancelClick() {
    this.resetEditor()
    this.$emit("cancel")
  }

  async makeSaveRequest():Promise<AxiosResponse<any>> {
    let response
    if(this.editor.index != null) {
      response = await requestMaker.settings.updateSettingValue(this.serviceId, {
        index: this.editor.index,
        value: this.editor.value
      })
    }
    else {
      response = await requestMaker.settings.createNewSettingValue(this.serviceId, { value: this.editor.value })
    }

    return response
  }

  async onEditorSaveClick() {
    this.is_waiting = true
    const response = await this.makeSaveRequest()
    this.is_waiting = false

    const handleFailedRequest = (res_data:any) => {
      if("error" in res_data) {
        this.editor.validation = false
        this.editor.error = res_data.error.message
        return true
      }
      
      if(res_data.validation === false) {
        return true
      }

      return false
    }

    const res_data = response.data

    if(handleFailedRequest(res_data)) {
      return
    }

    const { validation, result, setting_value } = res_data

    this.$emit("save", setting_value, this.editor.index)
    this.resetEditor()
  }

  /**
   * Called by the client-code
   */
  openEditor(value:any, index:number|null) {
    this.editor.is_open = true
    this.editor.value = value
    this.editor.index = index
  }

  resetEditor() {
    this.editor.is_open = false
    this.setEditorDefaultValue()
    this.editor.index = null
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