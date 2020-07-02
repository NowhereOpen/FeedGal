import _ from "lodash"
import { EntriesResult, PaginationData, Entry } from "../../../../base/types"
import { getSummonerLatestMatchesWithDetails } from "~/src/server/lib/loader-module-helpers/services/riot"
import { MatchDetail } from "~/src/server/lib/loader-module-helpers/services/riot/lib/entity"
import { RATE_LIMIT } from "~/src/common/warning-error"

export async function getEntries(api_key:string, region:string, summoner_name:string, pagination_value?:any):Promise<EntriesResult> {
  let data:MatchDetail
  try {
    data = await getSummonerLatestMatchesWithDetails(region, summoner_name, api_key, pagination_value)
  }
  catch(e) {
    if(_.get(e, "response.status") == 429) {
      return { entries: [], warning: RATE_LIMIT }
    }
    else {
      throw e
    }
  }

  const match_details_list = data!.match_details_list

  return {
    entries: match_details_list.map(formatEntries),
    service_response: match_details_list,
    pagination_data: makePaginationData(pagination_value)
  }
}

function formatEntries(entry:any):Entry {
  const {
    match, match_details, match_history_url, match_details_url,
    champion, summoner,
    summoner_match_summary
  } = entry

  const summoner_name = summoner.name

  const urls = {
    "fow.kr": {
      summoner_url: `http://fow.kr/find/${summoner_name}`
    },
    "op.gg": {
      summoner_url: `https://www.op.gg/summoner/userName=${summoner_name}`
    },
    "poro.gg": {
      summoner_url: `https://poro.gg/ko/s/kr/${summoner_name}`
    },
  }

  const { game_result, game_map_description } = summoner_match_summary

  const match_title = `[${game_result}] ${game_map_description.name}`
  const match_content = `${match_details_url}\n` + 
    `${urls['fow.kr'].summoner_url}\n` + 
    `${urls['op.gg'].summoner_url}\n` + 
    `${urls['poro.gg'].summoner_url}`

  return {
    service_id: "league-of-legends",
    id: match.id,
    title: match_title,
    content: match_content,
    datetime_info: match.timestamp,
    contexts: [
      { name: "LoL" },
      { name: summoner_name, url: match_history_url },
      { name: "Match history", url: match_details_url }
    ],
    resources: {
      main: { type: "img", value: champion.urls.profile_art }
    },
    json_content: entry,
    // child_resources: {}
  }
}

/**
 * Needs to be separated into service setting or app setting
 */
const TOTAL_RECORDS_PER_DATA = 5

/**
 * TODO 2019-11-25 00:10 Pagination data is updated even for no or errorneous entries.
 * I don't want to update the pagination data in this case.
 */
function getPaginationData(pagination_index:number):PaginationData {
  const pagination_data = makePaginationData(pagination_index)
  return pagination_data
}

function makePaginationData(pagination_value?:any):PaginationData {
  const minBeginIndex = 0
  const minEndIndex = TOTAL_RECORDS_PER_DATA

  if(pagination_value == undefined) {
    return {
      old: {
        beginIndex: TOTAL_RECORDS_PER_DATA,
        endIndex: TOTAL_RECORDS_PER_DATA * 2
      },
      new: {
        beginIndex: 0,
        endIndex: TOTAL_RECORDS_PER_DATA
      }
    }
  }
  else {
    return {
      old: {
        beginIndex: pagination_value.endIndex,
        endIndex: pagination_value.endIndex + TOTAL_RECORDS_PER_DATA
      },
      new: {
        beginIndex: pagination_value.beginIndex - TOTAL_RECORDS_PER_DATA,
        endIndex: pagination_value.beginIndex
      }
    }
  }
}