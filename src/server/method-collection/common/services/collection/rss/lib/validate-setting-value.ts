import * as _ from "lodash"

import { getRssFeedResponse } from "~/src/server/lib/loader-module-helpers/services/rss"

import { Rss } from "~/src/common/setting-value-validation/validate"

import {
  SettingValueValidationBase,
  ResDataForValidation,
} from "../../../base/setting-value-validation-base"
import { Rss as ValidationObjects } from "~/src/common/setting-value-validation/validation-object"

// Types
import { RssSettingValue } from "~/src/common/types/common/setting-value"
import { RssInvalidReason, InvalidReason } from "~/src/common/types/common/setting-value-validation"

export class RssSettingValueValidation extends SettingValueValidationBase<RssSettingValue> {
  preValidate() {
    return Rss.validateValidUrl(this.setting_value)
  }

  async getSettingValueData() {
    /**
     * 2020-07-11 10:16
     * 
     * Should throw bunch of errors if it fails.
     */
    const response = await getRssFeedResponse(this.setting_value.url)
    const original_title = response.title!

    return <RssSettingValue> {
      title: this.setting_value.title, 
      original_title,
      url: this.setting_value.url
    }
  }

  convertErrorToInvalidReason(error:any) {
    if(error) {
      console.log(error)
      return ValidationObjects.TEST_REQUEST_ERROR()
    }

    return undefined
  }

  /**
   * 2020-07-11 10:06
   * 
   * Rely on `getSettingValueData` throwing error. Don't know what to validate
   * when testing rss url by requesting rss feeds do succeed.
   */
  async validate(data:any) {
    return undefined
  }

  getSettingValue(data:any) {
    return {
      title: this.setting_value.title,
      original_title: data.original_title,
      url: this.setting_value.url
    }
  }
}