import * as _ from "lodash"
import * as common from "../../../common"
import { getRiotApiUrl } from "./utility"

/**
 * Class that uses api_key only
 * 
 * Region is REQUIRED for using 
 */
export class LolRequest {
  region:string
  api_key:string

  constructor(region:string, api_key:string) {
    this.region = region
    this.api_key = api_key
  }

  async makeRequest(method:string, url:string, req_data?:any) {
    const api_url = getRiotApiUrl(this.region)
    const axios_config:any = {
      baseURL: api_url,
      params: { api_key: this.api_key }
    };
  
    const { data } = await common.makeRequest(method, url, axios_config, req_data)
    return data
  }

  async getSummonerWithName(summoner_name:string) {
    const _summoner_name = encodeURIComponent(summoner_name)
    const data = await this.makeRequest("get", `/lol/summoner/v4/summoners/by-name/${_summoner_name}`)
    return data
  }

  async getSummonerLatestMatchesWithAccountId(account_id:string, params?:any) {
    const data = await this.makeRequest("get", `/lol/match/v4/matchlists/by-account/${account_id}`, { params })
    return data
  }

  async getMatchDetailsWithMatchId(match_id:string) {
    const data = await this.makeRequest("get", `/lol/match/v4/matches/${match_id}`)
    return data
  }

  async summonerExists(summoner_name:string) {
    try {
      const res_data = await this.getSummonerWithName(summoner_name)
      return true
    }
    catch(e) {
      if(_.get(e, "response.data.status.status_code", false) == 404) {
        return false
      }

      throw e
    }
  }
}