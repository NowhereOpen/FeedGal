import urlJoin from "url-join"
import moment from "moment"

import { LoaderModuleOutput, PaginationData, Entry } from "~/src/server//loader-module-collection/loader-module-base/types"
import { getBestListing } from "~/src/server/lib/loader-module-helpers/services/reddit"

export async function getEntries(reddit_cred:any, pagination_param?:any):Promise<LoaderModuleOutput> {
  const response = await getBestListing(reddit_cred, pagination_param)
  let pagination_data = { old: undefined, new: undefined }
  if(response.data.children.length > 0) {
    pagination_data = getPaginationData(response)
  }

  return {
    entries: response.data.children.map(formatEntries),
    pagination_data,
    service_response: response
  }
}

function formatEntries(_entry:any):Entry {
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

/**
 * May need to return `new: { before: post_id }, old: { after: post_id }` if `direction` isn't
 * passed for `getServiceEntries`.
 */
function getPaginationData(res_data:any):PaginationData {
  // Reddit `data.before` is null for non-pagination request
  return {
    new: res_data.data.before,
    old: res_data.data.after
  }
}