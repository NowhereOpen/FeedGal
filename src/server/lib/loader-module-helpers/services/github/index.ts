import * as querystring from "querystring"
import urlJoin from "url-join"
import * as _ from "lodash"
import axios, { AxiosRequestConfig } from "axios"

import * as common from "../../common"

export async function makeRequest(method:string, url:string, access_token:string, req_data?:any) {
  const axios_config:any = {
    headers: {
      Authorization: `token ${access_token}`
    },
    baseURL: "https://api.github.com"
  };

  const { data } = await common.makeRequest(method, url, axios_config, req_data)
  return data
}

export async function getUserInfo(access_token:string) {
  return await makeRequest("get", "user", access_token)
}

/**
 * 
 * @param token_response 
 */
export function getAccessTokenFromTokenResponse(token_response:any) {
  if(typeof token_response == "string") {
    const parsed_token_response = parseTokenResponse(token_response)
    return parsed_token_response["access_token"]
  }
  else {
    return token_response.token
  }
}

/**
 * Github sends a string type that can be parsed with `querystring` module
 * when requesting a token, but returns JSON when refreshing the token.
 * 
 * @param url 
 */
function parseTokenResponse(token_response:any) {
  if(typeof token_response == "string") {
    const parsed_token_response = querystring.parse(token_response);
    return parsed_token_response
  }
  else {
    return token_response
  }
}

export async function getUserRepos(access_token:string, req_data?:any) {
  /**
   * https://developer.github.com/v3/guides/traversing-with-pagination/#changing-the-number-of-items-received
   * 
   * Maximum is 100
   */
  const per_page = 100
  let all_repos = await makeRequest("get", "user/repos", access_token, { params: Object.assign({ per_page }, req_data.params) })
  
  let page = 2
  while(true) {
    const more_repos = await makeRequest("get", "user/repos", access_token, { params: Object.assign({ per_page, page }, req_data.params) })
    if(more_repos.length == 0) {
      break
    }

    all_repos = all_repos.concat(more_repos)
    page++
  }

  return all_repos
}

export async function getRepo(access_token:string, user_name:string, repo_name:string) {
  return await makeRequest("get", `/repos/${user_name}/${repo_name}`, access_token)
}

export async function getBranches(owner:string, repo:string, access_token:string) {
  return await makeRequest("get", `/repos/${owner}/${repo}/branches`, access_token)
}

export async function getCommits(owner:string, repo:string, access_token:string, req_data?:any) {
  return await makeRequest("get", `/repos/${owner}/${repo}/commits`, access_token, req_data)
}

/**
 * https://developer.github.com/v3/activity/events/#list-events-performed-by-a-user
 * 
 * Has a restriction of 300 entries or events up to last 90 days. So, using pagination to
 * load entries make sense.
 * 
 * @param username
 * @param access_token
 */
export async function getAllEvents(username:string, access_token:string) {
  const per_page = 100
  let all_repos = await makeRequest("get", `/users/${username}/events`, access_token, { params: { per_page } })
  
  let page = 2
  while(true) {
    let more_repos
    try {
      more_repos = await makeRequest("get", `/users/${username}/events`, access_token, { params: { per_page, page } })
    }
    catch(e) {
      /**
       * 422 error with message
       * 
       *   > 'In order to keep the API fast for everyone, pagination is limited for this resource. Check the
       *     rel=last link relation in the Link response header to see how far back you can traverse.'
       * 
       * is thrown when going beyond the restriction.
       */
      if("response" in e && "data" in e.response && e.response.status == 422) {
        console.log("[github raw services library][getAllEvents] 422 error:")
        console.log(e.response.data.message)
        console.log("[github raw services library][getAllEvents] Should be handled.")
        break;
      }

      throw e
    }

    if(more_repos.length == 0) {
      break
    }

    all_repos = all_repos.concat(more_repos)
    page++
  }

  return all_repos
}

export async function repoExists(username:string, repo:string, access_token:string) {
  try {
    await getBranches(username, repo, access_token)
    return true
  }
  catch(e) {
    if(_.get(e, "response.data.message", false)) {
      return false
    }

    throw e
  }
}