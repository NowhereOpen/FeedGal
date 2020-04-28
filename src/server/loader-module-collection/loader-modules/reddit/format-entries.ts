import urlJoin from "url-join"
import moment from "moment"

import { GystEntry } from "~/src/gyst/common/types/gyst-entry"

export function formatEntries(_entry:any):GystEntry {
  const entry = _entry.data
  return {
    service_id: "reddit",
    id: entry.id,
    title: entry.title,
    content: entry.selftext != "" ? entry.selftext : entry.url,
    datetime_info: getCreatedFromEntry(entry),
    contexts: [
      { name: "Reddit", url: "https://reddit.com" },
      { name: entry.subreddit_name_prefixed, url: "https://reddit.com/" + entry.subreddit_name_prefixed },
      { name: "Post", url: urlJoin("https://reddit.com/", entry.permalink) }
    ],
    resources: {
      main: {
        type: "img",
        value: ["jpg", "png"].some(ext => (<string>entry.url).endsWith(ext)) ? entry.url : undefined
      }
    },
    json_content: entry,
  }
}

function getCreatedFromEntry(entry:any) {
  return moment(Number(String(entry.created_utc).padEnd(13, "0"))).toString()
}