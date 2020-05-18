import { NonOAuthLoaderModule } from "./loader-module-base/base"
import { OAuthBaseLoaderModule } from "./loader-module-base/oauth"

import { service_credentials_reader } from "~/src/server/service-credential-reader"

import { DarkSkyLoaderModule } from "./loader-modules/dark-sky"
import { GithubLoaderModule } from "./loader-modules/github"
import { GoogleCalendarLoaderModule } from "./loader-modules/google-calendar"
import { LeagueOfLegendsLoaderModule } from "./loader-modules/league-of-legends"
import { RedditLoaderModule } from "./loader-modules/reddit"
import { TrelloLoaderModule } from "./loader-modules/trello"
import { TwitchLoaderModule } from "./loader-modules/twitch"
import { TwitterLoaderModule } from "./loader-modules/twitter"
import { YouTubeLoaderModule } from "./loader-modules/youtube"

export let loader_collection:{ [service_id:string]: NonOAuthLoaderModule|OAuthBaseLoaderModule } = {}

export function setup() {  
  loader_collection = {
    "dark-sky": getDarkSky(),
    "github": getGithub(),
    "google-calendar": getGoogleCalendar(),
    "league-of-legends": getLeagueOfLegends(),
    "reddit": getReddit(),
    "trello": getTrello(),
    "twitch": getTwitch(),
    "twitter": getTwitter(),
    "youtube": getYouTube(),
  }
}


// function getBitbucket() {
//   const service_id = "bitbucket"
//   const client_id = service_credentials_reader.getClientId(service_id)
//   const client_secret = service_credentials_reader.getClientSecret(service_id)
//   const instance = new BitbucketLoaderModule(client_id, client_secret)
// }

function getDarkSky() {
  const instance = new DarkSkyLoaderModule("dark-sky")
  return instance
}

// function getFacebook() {
//   const service_id = "facebook"
//   const client_id = service_credentials_reader.getClientId(service_id)
//   const client_secret = service_credentials_reader.getClientSecret(service_id)
//   const instance = new FacebookLoaderModule(client_id, client_secret, redirect_url)
// }

function getGithub() {
  const instance = new GithubLoaderModule()
  return instance
}

function getGoogleCalendar() {
  new GoogleCalendarLoaderModule()
  const instance = new GoogleCalendarLoaderModule()
  return instance
}

function getLeagueOfLegends() {
  const api_key = service_credentials_reader.getApiKey("riot")
  const instance = new LeagueOfLegendsLoaderModule(api_key)
  return instance
}

function getReddit() {
  const user_agent = service_credentials_reader.getExtraProp("reddit", ["user-agent"])
  const instance = new RedditLoaderModule(user_agent)
  return instance
}

function getTrello() {
  const consumer_key = service_credentials_reader.getConsumerKey("trello")
  const instance = new TrelloLoaderModule(consumer_key)
  return instance
}

function getTwitch() {
  const client_id = service_credentials_reader.getClientId("twitch")
  const instance = new TwitchLoaderModule(client_id)
  return instance
}

function getTwitter() {
  const service_id = "twitter"
  const consumer_key = service_credentials_reader.getConsumerKey(service_id)
  const consumer_secret = service_credentials_reader.getConsumerSecret(service_id)

  const cred = {
    consumer_key, consumer_secret,
  }
  const instance = new TwitterLoaderModule(cred)
  return instance
}

function getYouTube() {
  const instance = new YouTubeLoaderModule()
  return instance
}