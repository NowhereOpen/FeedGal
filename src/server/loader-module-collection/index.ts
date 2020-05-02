import { ContentServiceBase } from "./loader-module-base"

import { service_credentials_reader } from "~/src/server/service-credential-reader"

import { ContentService as DarkSkyContentService } from "./loader-modules/dark-sky"
import { ContentService as GithubContentService } from "./loader-modules/github"
import { ContentService as GoogleCalendarContentService } from "./loader-modules/google-calendar"
import { ContentService as GystContentService } from "./loader-modules/gyst"
import { ContentService as LeagueOfLegendsContentService } from "./loader-modules/league-of-legends"
import { ContentService as RedditContentService } from "./loader-modules/reddit"
import { ContentService as TrelloContentService } from "./loader-modules/trello"
import { ContentService as TwitchContentService } from "./loader-modules/twitch"
import { ContentService as TwitterContentService } from "./loader-modules/twitter"
import { ContentService as YouTubeContentService } from "./loader-modules/youtube"

export let loader_collection:{ [service_id:string]: any } = {}

export function setup() {  
  loader_collection = {
    "dark-sky": getDarkSky,
    "github": getGithub,
    "google-calendar": getGoogleCalendar,
    // "gyst": new GystContentService("gyst"),
    "league-of-legends": getLeagueOfLegends,
    "reddit": getReddit,
    "trello": getTrello,
    "twitch": getTwitch,
    "twitter": getTwitter,
    "youtube": getYouTube,
  }
}

function getDarkSky() {
  const instance = new DarkSkyContentService("dark-sky")
}

function getBitbucket() {
  const service_id = "bitbucket"
  const client_id = service_credentials_reader.getClientId(service_id)
  const client_secret = service_credentials_reader.getClientSecret(service_id)
  const instance = new Bitbucket(client_id, client_secret)
}

function getFacebook() {
  const service_id = "facebook"
  const client_id = service_credentials_reader.getClientId(service_id)
  const client_secret = service_credentials_reader.getClientSecret(service_id)
  const instance = new Facebook(client_id, client_secret, redirect_url)
}

function getGithub(access_token:string) {
  new GithubContentService("github")
  const service_id = "github"
  const client_id = service_credentials_reader.getClientId(service_id)
  const client_secret = service_credentials_reader.getClientSecret(service_id)
  const instance = new Github(client_id, client_secret, redirect_url)
}

function getGoogleCalendar(access_token:string) {
  new GoogleCalendarContentService("google-calendar")
  const service_id = "google"
  const client_id = service_credentials_reader.getClientId(service_id)
  const client_secret = service_credentials_reader.getClientSecret(service_id)
  const instance = new Google(client_id, client_secret, redirect_url)
}

function getLeagueOfLegends() {
  const api_key = service_credentials_reader.getApiKey("riot")
  new LeagueOfLegendsContentService("league-of-legends")
}

function getReddit(access_token:string) {
  const user_agent = service_credentials_reader.getExtraProp(service_id, ["user-agent"])
  new RedditContentService("reddit")
}

function getTrello(access_token:string) {
  const consumer_key = service_credentials_reader.getConsumerKey(service_id)
  new TrelloContentService("trello")
}

function getTwitch(access_token:string) {
  new TwitchContentService("twitch")
}

function getTwitter(token_data:any) {
  const service_id = "twitter"
  const consumer_key = service_credentials_reader.getConsumerKey(service_id)
  const consumer_secret = service_credentials_reader.getConsumerSecret(service_id)
  const { access_token_key, access_token_secret } = token_data
  const cred = {
    consumer_key, consumer_secret,
    access_token_key, access_token_secret
  }
  new TwitterContentService("twitter")
}

function getYouTube(access_token:string) {
  new YouTubeContentService("youtube")
}