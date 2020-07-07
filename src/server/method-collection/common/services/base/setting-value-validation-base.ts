import { ValidationResult } from "~/src/common/types/pages/suite"

export type ResDataForValidation = any

export type InvalidReasonOutput = string | void

export abstract class SettingValueValidationBase<T=any> {
  setting_value:T

  constructor(setting_value:T) {
    this.setting_value = setting_value
  }
  
  public async getResult():Promise<ValidationResult> {
    const invalid_reason = this.preValidate()
    if(invalid_reason != null) {
      return this.getInvalidOutput(invalid_reason)
    }
    
    try {
      const data = await this.getSettingValueData()
      const invalid_reason = await this.validate(data)

      if(invalid_reason) {
        return this.getInvalidOutput(invalid_reason)
      }
      else {      
        return this.getValidOutput(data)
      }
    }
    catch(e) {
      /**
       * 2020-07-04 13:17
       * 
       * ONLY convert errors that SHOULD be considered as invalid setting value. For example,
       * LoL API returns 404 for summoner name that doesn't exist. However 403 error which is
       * associated with the Api key SHOULD NOT be considered as invalid setting value. In
       * such case, return undefined.
       */
      const invalid_reason = this.convertErrorToInvalidReason(e)

      if(invalid_reason) {
        return this.getInvalidOutput(invalid_reason)
      }
      else {
        throw e
      }
    }
  }

  getValidOutput(data:any):ValidationResult {
    const setting_value = this.getSettingValue(data) 
    return { is_valid: true, data, setting_value }
  }

  getInvalidOutput(invalid_reason:string):ValidationResult {
    return { is_valid: false, setting_value: this.setting_value, invalid_reason }
  }

  /**
   * Override in case where the subclass wants to use a value included in the res data.
   */
  async getSettingValueData() {
    return this.setting_value
  }

  // Refer to 2020-07-04 13:17 comment above
  abstract convertErrorToInvalidReason(e:any):string|undefined

  /**
   * Assume that it's true if retrieving `res_data` had no problem.
   */
  validate(res_data:ResDataForValidation):Promise<InvalidReasonOutput>|InvalidReasonOutput {
    return
  }
  getSettingValue(res_data:ResDataForValidation):any {
    return this.setting_value
  }
  
  abstract preValidate():InvalidReasonOutput
}