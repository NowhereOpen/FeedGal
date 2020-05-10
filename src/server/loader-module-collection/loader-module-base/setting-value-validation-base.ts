import { ValidationResult } from "./types"

export type ResDataForValidation = any

export class ControlledError extends Error {}

export abstract class SettingValueValidationBase {
  setting_value:any

  constructor(setting_value:any) {
    this.setting_value = setting_value
  }

  /**
   * Override in case where the subclass wants to use a value included in the res data.
   */
  async getSettingValueData() {
    return this.setting_value
  }
  abstract getErrorMessage(e:any):(string|undefined)|Promise<string|undefined>
  /**
   * Assume that it's true if retrieving `res_data` had no problem.
   */
  validate(res_data:ResDataForValidation):Promise<boolean>|boolean {
    return true
  }
  getSettingValue(res_data:ResDataForValidation):any {
    return this.setting_value
  }
  /**
   * Subclass can override this to validate `this.setting_value`,
   * eg, to throw error if empty string
   */
  preValidate() {}

  public async getResult():Promise<ValidationResult> {
    try {
      this.preValidate()
      
      const res_data = await this.getSettingValueData()
      const is_valid = await this.validate(res_data)
      const setting_value = this.getSettingValue(res_data)

      return {
        is_valid, res_data, setting_value
      }
    }
    catch(e) {
      let error_message = undefined
      // This includes `DuplicateSettingValueError` thrown by `this.validateDuplicate` in the try clause.
      if(e instanceof ControlledError) {
        error_message = e.message
      }
      else {
        error_message = await this.getErrorMessage(e)
        if(error_message == undefined) {
          // Will be caught in the upper level
          throw e
        }
      }
      return {
        is_valid: false, setting_value: this.setting_value, error_message
      }
    }
  }
}