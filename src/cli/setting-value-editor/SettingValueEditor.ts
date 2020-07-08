import { Vue } from "nuxt-property-decorator"
import _ from "lodash"

import { Common } from "~/src/common/setting-value-validation/validation-object"
import { CommonInvalidReason, InvalidReason } from "~/src/common/types/common/setting-value-validation"

export abstract class SettingValueEditorBase<T, U=any> extends Vue {
  abstract value:T

  original_value:T|null = null

  /**
   * 2020-07-07 14:51
   * 
   * At least one and REQUIRED validation. Check whether the value is the same or not.
   * Setting value data structure are different for all service settings and are usually
   * more complex than a primary string. So this is required.
   */
  abstract validateBeforeRequestImpl(new_value:T):InvalidReason|undefined
  validateBeforeRequest(new_value:T, values:T[]):InvalidReason|undefined {
    // Updating requires value to be different
    if(this.original_value != null) {
      const result = this.validateDifferentValue()
      if(result != undefined) return result
    }

    const invalid_unique_value = this.validateUniqueValue(values)
    if(invalid_unique_value != undefined) {
      return invalid_unique_value
    }

    return this.validateBeforeRequestImpl(new_value)
  }

  validateDifferentValue():undefined|CommonInvalidReason {
    let is_same = _.isEqual(this.original_value, this.value)

    if(is_same) {
      return Common.SAME_VALUE()
    }
  }

  validateUniqueValue(values:T[]):undefined|CommonInvalidReason {
    const exists = -1 < values.findIndex(value => _.isEqual(this.value, value))
    if(exists) {
      return Common.VALUE_EXISTS()
    }
  }

  abstract renderValidationError(invalid_reason:InvalidReason):void
  
  loadValue(value:T):void {
    this.original_value = _.cloneDeep(value)
    this.value = _.cloneDeep(value)
  }
}