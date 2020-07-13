export type GithubSettingValue = {
  is_mine: boolean,
  owner: string,
  repo: string,
  user_id: string
}

export type GoogleCalendarSettingValue = {
  id: string,
  summary: string
}

export type LeagueOfLegendsSettingValue = {
  region: string,
  summoner_name: string
}

export type RssSettingValue = {
  /**
   * 2020-07-11 12:44
   * Empty string will be replaced with the original_title which is replaced or overridden
   * when getting rss feeds to validate the setting value.
   */
  title: string
  original_title: string
  url: string
}