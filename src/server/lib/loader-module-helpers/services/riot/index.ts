import { data_dragon } from "./lib/data-dragon"
import { MatchDetail } from "./lib/entity"
import { LolRequest } from "./lib/lol-request-base"
import {
  makeOfficialMatchDetailsUrl,
  makeOfficialMatchHistoryUrl,
  makeSummonerMatchSummary
} from "./lib/utility"

export async function getSummonerLatestMatchesWithDetails(region:string, summoner_name:string, api_key:string, params?:any):Promise<MatchDetail> {  
  const lol_request = new LolRequest(region, api_key)
  const summoner = await lol_request.getSummonerWithName(summoner_name)
  const account_id = summoner.accountId
  const matchlist = await lol_request.getSummonerLatestMatchesWithAccountId(account_id, params)
  let matches = matchlist.matches

  // Limit to avoid rate limits.
  matches = matches.slice(0, 5)

  const match_details_list = await Promise.all(matches.map(async (match:any) => {
    const champion_id = match.champion

    const champion = data_dragon.getChampionDetailWithId(champion_id)
    const match_details = await lol_request.getMatchDetailsWithMatchId(match.gameId)
    const match_details_url = makeOfficialMatchDetailsUrl(summoner, match_details)
    const match_history_url = makeOfficialMatchHistoryUrl(summoner, match_details)

    const summoner_match_summary = makeSummonerMatchSummary(summoner, match, match_details)
    /**
     * 2019-09-15 01:33 Add the map description from here for now.
     */
    summoner_match_summary.game_map_description = data_dragon.getMapDescription(match_details.queueId)

    return {
      match, match_details,
      champion, summoner,
      match_history_url,
      match_details_url,
      summoner_match_summary
    }
  }))

  const { startIndex, endIndex, totalGames } = matchlist
  return { match_details_list, startIndex, endIndex, totalGames, region }
}

export async function makeRequest(region:string, method:string, path:string, api_key:string, req_data?:any) {
  const lol_request = new LolRequest(region, api_key)
  return await lol_request.makeRequest(method, path, req_data)
}