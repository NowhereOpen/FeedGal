/**
 * https://developer.riotgames.com/docs/lol#_platform-routing-values
 */
export function getRiotApiUrl(region:string) {
  let api_url
  if(region == "BR1") {
    api_url = "br1.api.riotgames.com"
  }
  else if(region == "EUN1") {
    api_url = "eun1.api.riotgames.com"
  }
  else if(region == "EUW1") {
    api_url = "euw1.api.riotgames.com"
  }
  else if(region == "JP1") {
    api_url = "jp1.api.riotgames.com"
  }
  else if(region == "KR") {
    api_url = "kr.api.riotgames.com"
  }
  else if(region == "LA1") {
    api_url = "la1.api.riotgames.com"
  }
  else if(region == "LA2") {
    api_url = "la2.api.riotgames.com"
  }
  else if(region == "NA1") {
    api_url = "na1.api.riotgames.com"
  }
  else if(region == "OC1") {
    api_url = "oc1.api.riotgames.com"
  }
  else if(region == "TR1") {
    api_url = "tr1.api.riotgames.com"
  }
  else if(region == "RU") {
    api_url = "ru.api.riotgames.com"
  }
  else {
    console.log(`INVALID REGION:`, region)
    const e = new Error("Invalid region. If valid, check the capitalization?")
    Object.assign(e, { region })
    throw e
  }

  api_url = "https://" + api_url
  return api_url
}

/**
 * `<match history url>/<lang ?>/#match-details/<Platform id, eg, KR>/<gameId>/<summoner 'raw' Id>`
 *
 * Having the `summoner raw id` will highlight the user's border
 * 
 * Refer to `https://developer.riotgames.com/regional-endpoints.html` for the `<match history url>`.
 * 
 * Everything else works with `matchhistory.<region>.leagueoflegends.com` where the `<region` is the
 * "SERVICE REGION" in the "Service Proxies" table, except for Korean which only works with:
 * 
 * `http://matchhistory.leagueoflegends.co.kr`
 * 
 * ... as of 2019-09-15 00:10.
 * 
 * @param summoner The full object of the summoner
 * @param match The full object of `/lol/match/v4/matches/${match_id}` response
 */
export function makeOfficialMatchDetailsUrl(summoner:any, match:any) {
  const gameId = match.gameId
  const platform = match.platformId
  const _summoner_participant = match.participantIdentities.find((identity:any) => identity.player.accountId == summoner.accountId)
  const summoner_participant = _summoner_participant.player
  const match_history_uri:string = summoner_participant.matchHistoryUri
  // They seem to call it the "raw" id and the summoner id the "encrypted id".
  const summoner_raw_id = match_history_uri.split("/").slice(-1)

  let match_history_url = ""
  if(platform == "KR") {
    match_history_url = "http://matchhistory.leagueoflegends.co.kr"
  }
  else {
    // "platform" works with capitalized form, however.
    match_history_url = `http://matchhistory.${(<string>platform).toLowerCase()}.leagueoflegends.com`
  }
  match_history_url += `#match-details/${platform}/${gameId}/${summoner_raw_id}`

  return match_history_url
}

/**
 * Returns the url to summoner's ALL the matches.
 * 
 * @param match_history_uri 
 */
export function makeOfficialMatchHistoryUrl(summoner:any, match:any) {
  const gameId = match.gameId
  const platform = match.platformId
  const _summoner_participant = match.participantIdentities.find((identity:any) => identity.player.accountId == summoner.accountId)
  const summoner_participant = _summoner_participant.player
  const match_history_uri:string = summoner_participant.matchHistoryUri
  // They seem to call it the "raw" id and the summoner id the "encrypted id".
  const summoner_raw_id = match_history_uri.split("/").slice(-1)

  let match_history_url = ""
  if(platform == "KR") {
    match_history_url = "http://matchhistory.leagueoflegends.co.kr"
  }
  else {
    // "platform" works with capitalized form, however.
    match_history_url = `http://matchhistory.${(<string>platform).toLowerCase()}.leagueoflegends.com`
  }
  match_history_url += `#match-history/${platform}/${summoner_raw_id}`

  return match_history_url
}

/**
 * Extract summoner's information from "participants" and "team" information of the `match_details`
 * 
 * I don't think this is coupled to GYST.
 * 
 * @param summoner Return value of `/lol/summoner/v4/summoners/by-name/${summoner_name}`
 * @param match An item in the return value of `/lol/match/v4/matchlists/by-account/${uid}`
 * @param match_details Return value of `/lol/match/v4/matches/${match_id}`
 */
export function makeSummonerMatchSummary(summoner:any, match:any, match_details:any) {
  const participantIdentity = match_details.participantIdentities.find((identity:any) => identity.player.accountId == summoner.accountId)
  const participant_id = participantIdentity.participantId
  const participant = match_details.participants.find((participant:any) => participant.participantId == participant_id)
  const team_id = participant.teamId
  const team = match_details.teams.find((team:any) => team.teamId == team_id)
  const win = participant.stats.win
  const game_result = win ? "Victory" : "Defeat"
  
  const game_type_constant = match_details.queueId
  // const game_map_description = getGameMapDescription(game_type_constant)

  return {
    team, participant, participantIdentity, game_result,
    game_map_description: {}
  }
}