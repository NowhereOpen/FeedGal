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

export let loader_collection:{ [service_id:string]: ContentServiceBase } = {}

export function setup() {
  
  loader_collection = {
    "dark-sky": new DarkSkyContentService("dark-sky"),
    "github": new GithubContentService("github"),
    "google-calendar": new GoogleCalendarContentService("google-calendar"),
    "gyst": new GystContentService("gyst"),
    "league-of-legends": new LeagueOfLegendsContentService("league-of-legends"),
    "reddit": new RedditContentService("reddit"),
    "trello": new TrelloContentService("trello"),
    "twitch": new TwitchContentService("twitch"),
    "twitter": new TwitterContentService("twitter"),
    "youtube": new YouTubeContentService("youtube"),
  }
}