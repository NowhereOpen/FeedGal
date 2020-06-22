/**
 * 2020-06-18 22:40
 * 
 * Could move this into `cred-module-suite`
 */
//

import {
  BitbucketLib,
  FacebookLib,
  GithubLib,
  GoogleLib,
  RedditLib,
  TrelloLib,
  TwitchLib,
  TwitterLib
} from "oauth-module-suite"

/**
 * 
 * @param service_id "oauth_service_id"
 * @param e AxiosError or any because `twitter` module returns an array.
 */
export function isTokenError(service_id:string, e:any) {
  if(service_id == "bitbucket") {
    return BitbucketLib.isTokenInvalidOrExpired(e)
  }
  else if(service_id == "facebook") {
    return FacebookLib.isInvalidToken(e) || FacebookLib.isTokenExpired(e)
  }
  else if(service_id == "github") {
    return GithubLib.isTokenInvalidOrExpired(e)
  }
  else if(service_id == "google") {
    return GoogleLib.isTokenInvalidOrExpired(e)
  }
  else if(service_id == "reddit") {
    return RedditLib.isTokenInvalidOrExpired(e)
  }
  else if(service_id == "trello") {
    return TrelloLib.isTokenInvalid(e)
  }
  else if(service_id == "twitch") {
    return TwitchLib.isTokenInvalidOrExpired(e)
  }
  else if(service_id == "twitter") {
    return TwitterLib.isTokenInvalid(e)
  }

  console.error(`Service ${service_id} is not registered`)
  throw Error("Unknown service id.")
}