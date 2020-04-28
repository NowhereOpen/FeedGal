import * as _ from "lodash"

import { LolRequest } from "~/src/lib/gyst-entries-helper/services/riot/lib/lol-request-base"
import { SettingValueValidationBase, ResDataForValidation, ControlledError } from "~/src/gyst/server/base-class/service-module/setting-value-validation-base"
import { getCredential } from "./get-credential"

export class LeagueOfLegendsSettingValueValidation extends SettingValueValidationBase {
  async getSettingValueData() {
    /// @ts-ignore
    const api_key = await getCredential()
    const make_request = new LolRequest(this.setting_value.region, api_key)

    return await make_request.getSummonerWithName(this.setting_value.summoner_name)
  }

  getErrorMessage(error:any) {
    /**
     * 404 error response with:
     * 
     * `{"status":{"message":"Data not found - summoner not found","status_code":404}}`
     */
    if(error != undefined) {
      if(_.get(error, "response.data.status.status_code") == 404) {
        return "Summoner name was not found"
      }

      if(_.get(error, "response.data.status.status_code", false) == 403) {
        return "The server admin forgot to refresh the Riot API KEY 🤦."
      }
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