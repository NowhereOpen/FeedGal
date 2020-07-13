import { getRssFeedResponse } from "~/src/server/lib/loader-module-helpers/services/rss"

// Types
import { EntriesResult, PaginationData, Entry } from "../../../base/types"
import { RssSettingValue } from "~/src/common/types/common/setting-value"

/**
 * 2020-07-10 08:39
 * 
 * Refer to https://www.npmjs.com/package/rss-parser for different options that go
 * into `Parser`. Some RSS urls may require specific parser setting. None discovered
 * yet.
 */
export async function getEntries(setting_value:RssSettingValue):Promise<EntriesResult> {
  const rss_url = setting_value.url

  try {
    const result = await getRssFeedResponse(rss_url)
    /**
     * 2020-07-11 10:24
     * 
     * When and how is `result.items` undefined?
     */
    const entries = result.items!.map((entry:any) => formatEntries(entry, result)) || []

    return {
      entries,
      service_response: result,
      /**
       * 2020-07-12 08:56
       * The `key path` used for indexedDB storage for RSS feeds.
       */
      pagination_data: { old: [entries.slice(-1)[0].id] , new: null }
    }
  }
  catch(e) {
    // 2020-w28-todo14: https://trello.com/c/gShCvqKe/237-2020-w28-todos
    console.error(e)
    console.error(`An error occurred while getting entries for RSS.`)
    throw e
  }
}

function formatEntries(entry:any, parser_output:any):Entry {
  return {
    service_id: "rss",
    id: entry.guid || entry.id,
    title: entry.title,
    content: entry.contentSnippet || entry.content,
    /**
     * 2020-07-10 12:53
     * 
     * `rss-parser` attaches `isoDate` property to all variations it supports: atom and RSS (0.9, 1, 2 versions)
     * 
     * `https://github.com/rbren/rss-parser/blob/c3802262f421e8ff9cda8031684b113254ddb413/lib/parser.js#L31`
     * 
     * Look for `setISODate`
     */
    datetime_info: entry.isoDate,
    contexts: [
      { name: "RSS" },
      { name: parser_output.title, url: parser_output.link },
      { name: "To Original", url: entry.link }
    ],
    resources: {},
    json_content: entry,
  }
}