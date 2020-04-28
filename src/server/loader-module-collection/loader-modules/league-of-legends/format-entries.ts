import { GystEntry } from "~/src/gyst/common/types/gyst-entry"

export function formatEntries(entry:any):GystEntry {
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