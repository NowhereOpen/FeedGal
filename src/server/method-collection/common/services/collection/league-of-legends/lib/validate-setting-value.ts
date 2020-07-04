import * as _ from "lodash"

import { LolRequest } from "~/src/server/lib/loader-module-helpers/services/riot/lib/lol-request-base"
import {
  SettingValueValidationBase,
  ResDataForValidation,
  ControlledError
} from "../../../base/setting-value-validation-base"

export class LeagueOfLegendsSettingValueValidation extends SettingValueValidationBase {
  api_key:string
  
  constructor(api_key:string, setting_value:any) {
    super(setting_value)
    this.api_key = api_key
  }
  async getSettingValueData() {
    const make_request = new LolRequest(this.setting_value.region, this.api_key)

    return await make_request.getSummonerWithName(this.setting_value.summoner_name)
  }

  convertErrorToInvalidReason(error:any) {
    /**
     * 404 error response with:
     * 
     * `{"status":{"message":"Data not found - summoner not found","status_code":404}}`
     */
    if(_.get(error, "response.data.status.status_code") == 404) {
      return "Summoner name was not found"
    }
  }

  preValidate() {
    if(this.setting_value.region == "" || (<string>this.setting_value.summoner_name).trim() == "") {
      throw new ControlledError("Region or summoner name must not be empty.")
    }
  }

  getSettingValue(res_data:ResDataForValidation) {
    return {
      region: this.setting_value.region,
      summoner_name: res_data.name
    }
  }
}