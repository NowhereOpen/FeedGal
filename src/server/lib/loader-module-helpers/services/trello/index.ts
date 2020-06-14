import * as common from "../../common"

export type TrelloCred = { access_token:string, consumer_key:string }

export async function makeRequest(method:string, url:string, { access_token, consumer_key }:TrelloCred, req_data?:any) {
  const axios_config:any = {
    params: {
      key: consumer_key,
      token: access_token,
    },
    baseURL: "https://api.trello.com/1"
  };

  const { data } = await common.makeRequest(method, url, axios_config, req_data)
  return data
}

export async function getUserInfo(trello_cred:TrelloCred) {
  return await makeRequest("get", "members/me", trello_cred)
}

/**
 * https://developers.trello.com/reference#membersidboards
 * 
 * I dont' think this API uses pagination?
 * 
 * Refer to:
 * 
 *   - https://developers.trello.com/reference#section-nested-cards-as-url-params
 * 
 * Unlike cards, it doesn't have `limit` nor `since` or `before`
 * 
 * @param trello_cred 
 */
export async function getBoards(trello_cred:TrelloCred) {
  return await makeRequest("get", "members/me/boards", trello_cred)
}

/**
 * Refer to the following document section for pagination:
 * 
 *   - https://developers.trello.com/reference#section-nested-cards-as-url-params
 * 
 * Uses `limit` and `since`.
 * 
 * According to Trello document ([link](https://developers.trello.com/reference#boardsboardidtest))
 * the cards returned are sorted by list, not chronologically.
 * 
 * @param trello_cred 
 * @param board_id 
 * @param req_data 
 */
export async function getCards(trello_cred:TrelloCred, board_id:string, req_data?:any) {
  return await makeRequest("get", `/boards/${board_id}/cards`, trello_cred, req_data)
}

/**
 * Doesn't include pagination data. Pagination is done with `since` and `before` where the value
 * is the id of the action.
 * 
 * "before" will loading older actions.
 * 
 * I don't think `since` works properly. It works as if no pagination parameter is given. So, if I
 * request with `since=<65-th id>&limit=2`, I expect 63-rd, 64-th entries, but it just returns first
 * and second actions.
 * 
 * However, it works with before AND since. Returns entries excluding the ids used in before
 * and since.
 * 
 * @param trello_cred 
 * @param board_id `id` property of a board entry
 * @param req_data 
 */
export async function getActions(trello_cred:TrelloCred, board_id:string, req_data?:any) {
  const params = Object.assign({ entities: true }, req_data)
  return await makeRequest("get", `/boards/${board_id}/actions`, trello_cred, { params })
}

export async function getMemberAction(trello_cred:TrelloCred, params?:any) {
  const trello_params = {
    /**
     * This option adds "entities" property to the response which can be used for generating a
     * "friendly" text when each `entry.text` is appended together.
     */
    entities: true
  }

  if(params) {
    Object.assign(trello_params, params)
  }

  return await makeRequest("get", `/members/me/actions`, trello_cred, {
    params: trello_params
  })
}