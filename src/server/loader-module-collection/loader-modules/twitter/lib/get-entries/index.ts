import { LoaderModuleOutput, Entry } from "~/src/server//loader-module-collection/loader-module-base/types"
import { getHomeTimeline } from "~/src/server/lib/loader-module-helpers/services/twitter"

export async function getEntriesInit() {

}

export async function getEntriesPagination() {
  
}

function formatEntries(tweet:any):Entry {
  let main_media_img
  if("entities" in tweet && "media" in tweet.entities && tweet.entities.media[0].type == "photo") {
    main_media_img = tweet.entities.media[0].media_url_https
  }

  /**
   * Use enlarged thumbnail. Works with 200x200, 400x400. Doesn't work with 2000x2000, 123x123, nor 100x100
   * Seems like there are a fixed number of usable sizes.
   */
  const thumbnail_url = (<string>tweet.user.profile_image_url_https).replace(/normal(\..*)$/, "200x200$1")

  const url_info_resources = [
    { name: "Twitter", url: "https://twitter.com" },
    // Not intuitive to me, but `user.screen_name` is used in url and the `name` is used as the 'display' name.
    { name: tweet.user.name, url: `https://twitter.com/${tweet.user.screen_name}`},
    { name: "Tweet", url: `https://twitter.com/u/status/${tweet.id_str}`}
  ]

  if("retweeted_status" in tweet) {
    url_info_resources.push({ name: "Retweeted", url: `https://twitter.com/u/status/${tweet.retweeted_status.id_str}` })
  }

  return {
    service_id: "twitter",
    id: tweet.id_str,
    title: tweet.user.name,
    content: tweet.text,
    datetime_info: tweet.created_at,
    contexts: url_info_resources,
    resources: {
      main: { type: "img", value: main_media_img },
      thumbnail_url
    },
    json_content: tweet,
  }
}

function getPaginationOption(service_response:any) {
  const tweets = service_response
  return {
    new: tweets[0].id_str,
    old: tweets.slice(-1)[0].id_str
  }
}