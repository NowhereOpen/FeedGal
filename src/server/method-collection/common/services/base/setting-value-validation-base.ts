import { ValidationResult } from "~/src/common/types/pages/suite"

export type ResDataForValidation = any

export class ControlledError extends Error {}

export abstract class SettingValueValidationBase<T=any> {
  setting_value:T

  constructor(setting_value:T) {
    this.setting_value = setting_value
  }
  
  public async getResult():Promise<ValidationResult> {
    this.preValidate()
    
    try {
      const data = await this.getSettingValueData()
      const is_valid = await this.validate(data)
      const setting_value = this.getSettingValue(data)
      
      return {
        is_valid, data, setting_value
      }
    }
    catch(e) {
      const invalid_reason = this.convertErrorToInvalidReason(e)

      if(invalid_reason) {
        return {
          is_valid: false,
          setting_value: this.setting_value,
          invalid_reason: invalid_reason
        }
      }
      else {
        throw e
      }
    }
  }

  /**
   * Override in case where the subclass wants to use a value included in the res data.
   */
  async getSettingValueData() {
    return this.setting_value
  }

  /**
   * 2020-07-04 13:17
   * 
   * ONLY convert errors that SHOULD be considered as invalid setting value. For example,
   * LoL API returns 404 for summoner name that doesn't exist. However 403 error which is
   * associated with the Api key SHOULD NOT be considered as invalid setting value. In
   * such case, return undefined.
   */
  abstract convertErrorToInvalidReason(e:any):string|undefined

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
}