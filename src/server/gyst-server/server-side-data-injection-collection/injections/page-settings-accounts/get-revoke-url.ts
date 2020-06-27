/**
 * 2020-06-16 15:19
 * 
 * Could be refactored into the oauth-module-suite, but implementing it as an
 * app module because oauth-module-suite is supposed to be for 'general
 * purpose' and revoke url feels like its use case is too specific
 */
// 

import { RevokeInfo } from "src/common/types/pages/settings-accounts"

export function getRevokeInfo(service_id:string):RevokeInfo|undefined {
  if(service_id == "bitbucket") {
    return {
      url: "https://bitbucket.org/account/settings/app-authorizations/",
      msg: "Under 'You have authorized the following applications.' click 'Revoke' for 'FeedGal'."
    }
  }
  else if(service_id == "facebook") {
    return {
      url: "https://www.facebook.com/settings?tab=applications&ref=settings",
      msg: "Under 'Active' tab, select the checkbox for 'FeedGal' and click 'Delete'."
    }
  }
  else if(service_id == "github") {
    return {
      url: "https://github.com/settings/applications",
      msg: "Under 'Authorized OAuth Apps' find 'FeedGal' click '...' then click 'Revoke'."
    }
  }
  else if(service_id == "google") {
    return {
      url: "https://myaccount.google.com/permissions",
      msg: "Under 'Signing in with Google' find 'FeedGal', click, then 'Revoke Access'."
    }
  }
  else if(service_id == "reddit") {
    return {
      url: "https://www.reddit.com/prefs/apps/",
      msg: "Under 'authorized applications' find 'FeedGal' then click 'revoke access'."
    }
  }
  else if(service_id == "trello") {
    return {
      url: "https://trello.com/youngnam3/account",
      msg: "Under 'Settings' tab, 'Applications' section, find 'FeedGal' then click 'Revoke'."
    }
  }
  else if(service_id == "twitch") {
    return {
      url: "https://www.twitch.tv/settings/connections",
      msg: "Under 'Connections' tab, scroll down to 'Other Connections', find 'FeedGal' then click 'Disconnect'."
    }
  }
  else if(service_id == "twitter") {
    return {
      url: "https://twitter.com/settings/applications",
      msg: "Under 'App', find 'FeedGal', click it, under 'Permissions', click 'Revoke Access'."
    }
  }
}