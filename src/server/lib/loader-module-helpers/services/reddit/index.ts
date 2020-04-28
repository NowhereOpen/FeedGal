import * as common from "../../common"

type RedditHeader = { access_token:string, user_agent:string }

export async function makeRequest(method:string, url:string, { access_token, user_agent }:RedditHeader, req_data?:any) {
  const axios_config:any = {
    headers: {
      Authorization: `bearer ${access_token}`,
      "User-Agent": user_agent
    },
    baseURL: "https://oauth.reddit.com"
  };

  const response = await common.makeRequest(method, url, axios_config, req_data)
  const data = response.data
  return data
}

export async function getUserInfo(reddit_header:RedditHeader) {
  const res_data = await makeRequest("get", "api/v1/me", reddit_header)
  return res_data
}

export async function getBestListing(reddit_header:RedditHeader, params?:any) {
  return await makeRequest("get", "best", reddit_header, { params })
}

/**
 * @param parent_id The `id` property of a listing response data structure.
 * @param reddit_header 
 */
export async function getComments(parent_id:string, reddit_header:RedditHeader) {
  return await makeRequest("get", `comments/${parent_id}`, reddit_header)
}