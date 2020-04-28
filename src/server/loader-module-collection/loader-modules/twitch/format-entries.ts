import urlJoin from "url-join"

import { GystEntry } from "~/src/gyst/common/types/gyst-entry"

export function formatEntries(entry:any):GystEntry {
  const cur_stream_frame = (<string>entry.thumbnail_url).replace("{width}", "1280").replace("{height}", "720")
  const stream_url = `https://twitch.com/${entry.login}`

  const contexts = [
    { name: "Twitch", url: "https://twitch.com" },
    { name: entry.user_name, url: stream_url }
  ]

  /**
   * 2019-10-20 03:33 There are cases where the category or the 'game' is not displayed at all.
   * 
   * Checked today and one of them was in that state, so tested with GYST then through the Twitch API.
   * 
   * GYST loads it without the category, or the 'game' successfully as intended.
   * There are cases where `game_id=0`. In this case, including the category willbe skipped.
   */
  if(entry.category_name) {
    const url = urlJoin("https://www.twitch.tv/directory/game/", entry.category_name)
    contexts.splice(1, 0, { name: entry.category_name, url })
  }

  return {
    service_id: "twitch",
    id: entry.id,
    title: entry.title,
    content: stream_url,
    datetime_info: entry.started_at,
    contexts,
    resources: {
      main: { type: "img", value: cur_stream_frame },
      thumbnail_url: entry.profile_image_url
    },
    json_content: entry,
  }
}