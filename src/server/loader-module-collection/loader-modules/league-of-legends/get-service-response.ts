import { GetServiceResponse } from "~/src/gyst/server/base-class/service-module/get-service-response"
import { getSummonerLatestMatchesWithDetails } from "~/src/lib/gyst-entries-helper/services/riot"

export class GetLoLServiceResponse extends GetServiceResponse {
  async run() {
    const { region, summoner_name } = this.req_params
    const api_key = this.credential

    const data = await getSummonerLatestMatchesWithDetails(region, summoner_name, api_key, this.pagination_value)
    const match_details_list = data.match_details_list

    return match_details_list
  }
}