import * as _ from "lodash"

import { LolRequest } from "~/src/server/lib/loader-module-helpers/services/riot/lib/lol-request-base"
import {
  SettingValueValidationBase,
} from "../../../base/setting-value-validation-base"
import { LeagueOfLegendsInvalidReason, InvalidReason } from "~/src/common/types/common/setting-value-validation"
import { LeagueOfLegends } from "~/src/common/setting-value-validation/validate"
import { LeagueOfLegends as ValidationObjects } from "~/src/common/setting-value-validation/validation-object"

// Types
import { LeagueOfLegendsSettingValue } from "~/src/common/types/common/setting-value"

export class LeagueOfLegendsSettingValueValidation extends SettingValueValidationBase<LeagueOfLegendsSettingValue> {
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
      return ValidationObjects.SUMMONER_NOT_FOUND()
    }
  }

  preValidate() {
    return LeagueOfLegends.validate(this.setting_value)
  }

  getSettingValue(data:any) {
    return {
      region: this.setting_value.region,
      summoner_name: data.name
    }
  }
}