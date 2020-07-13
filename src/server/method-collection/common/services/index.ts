import { service_credentials_reader } from "~/src/server/service-credential-reader"

import { Methods } from "./base/types"

import {
  getMethods as getGithubMethods
} from "./collection/github"
import {
  getMethods as getGoogleCalendarMethods
} from "./collection/google-calendar"
import {
  getMethods as getLeagueOfLegendsMethods,
  setupLeageuOfLegends as _setupLeageuOfLegends
} from "./collection/league-of-legends"
import {
  getMethods as getRedditMethods,
  setupReddit as _setupReddit
} from "./collection/reddit"
import {
  getMethods as getRssMethods
} from "./collection/rss"
import {
  getMethods as getTrelloMethods,
  setupTrello as _setupTrello
} from "./collection/trello"
import {
  getMethods as getTwitchMethods,
  setupTwitch as _setupTwitch
} from "./collection/twitch"
import {
  getMethods as getTwitterMethods,
  setupTwitter as _setupTwitter
} from "./collection/twitter"
import {
  getMethods as getYouTubeMethods
} from "./collection/youtube"

export const collection:{ [service_id:string]: Methods } = {}

export function setup() {
  setupLeagueOfLegends()
  setupReddit()
  setupTrello()
  setupTwitch()
  setupTwitter()

  collection["github"] = getGithubMethods()
  collection["google-calendar"] = getGoogleCalendarMethods()
  collection["league-of-legends"] = getLeagueOfLegendsMethods()
  collection["reddit"] = getRedditMethods()
  collection["rss"] = getRssMethods()
  collection["trello"] = getTrelloMethods()
  collection["twitch"] = getTwitchMethods()
  collection["twitter"] = getTwitterMethods()
  collection["youtube"] = getYouTubeMethods()
}


// function getBitbucket() {
//   const service_id = "bitbucket"
//   const client_id = service_credentials_reader.getClientId(service_id)
//   const client_secret = service_credentials_reader.getClientSecret(service_id)
//   const instance = new BitbucketLoaderModule(client_id, client_secret)
// }

// function getFacebook() {
//   const service_id = "facebook"
//   const client_id = service_credentials_reader.getClientId(service_id)
//   const client_secret = service_credentials_reader.getClientSecret(service_id)
//   const instance = new FacebookLoaderModule(client_id, client_secret, redirect_url)
// }

function setupLeagueOfLegends() {
  const api_key = service_credentials_reader.getApiKey("riot")
  _setupLeageuOfLegends(api_key)
}

function setupReddit() {
  const user_agent = service_credentials_reader.getExtraProp("reddit", ["user-agent"])
  _setupReddit(user_agent)
}

function setupTrello() {
  const consumer_key = service_credentials_reader.getConsumerKey("trello")
  _setupTrello(consumer_key)
}

function setupTwitch() {
  const client_id = service_credentials_reader.getClientId("twitch")
  _setupTwitch(client_id)
}

function setupTwitter() {
  const service_id = "twitter"
  const consumer_key = service_credentials_reader.getConsumerKey(service_id)
  const consumer_secret = service_credentials_reader.getConsumerSecret(service_id)
  _setupTwitter(consumer_key, consumer_secret)
}