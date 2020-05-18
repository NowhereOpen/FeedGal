import * as _ from "lodash"
import * as common from "../../common"

export type TwitchCred = {
  access_token:string,
  client_id:string
}

export async function makeRequest(method:string, url:string, { access_token, client_id }:TwitchCred, req_data?:any) {
  const axios_config:any = {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Client-Id": client_id
    },
    baseURL: "https://api.twitch.tv/helix"
  };

  const { data } = await common.makeRequest(method, url, axios_config, req_data)
  return data
}

export async function getUserInfo(twitch_cred:TwitchCred) {
  const result = await makeRequest("get", "users", twitch_cred)
  const user_info = result.data[0]
  return user_info
}

export async function getLiveFollowedChannelsByUserId(twitch_cred:TwitchCred) {
  const user = await getUserInfo(twitch_cred)
  const followed_channels = await getFollwedChannelsWithUserId(user.id, twitch_cred)
  const followed_channel_ids = followed_channels.map(channel => channel.to_id)
  const _live_streams = await getLiveStreamsFromChannelIds(followed_channel_ids, twitch_cred)
  const live_streams = await attachUserEntity(_live_streams, twitch_cred)
  for(const live_stream of live_streams) {
    /**
     * 2019-10-20 03:36 Checked today that `game_id=0` corresponds to the case where the streams
     * appears without a category. In this case, `category_name` should be undefined.
     * 
     * Getting category for this case works but won't return any response. So skip
     */
    if(live_stream.game_id == "0") {
      continue
    }
    live_stream.category_name = await getCategory(live_stream.game_id, twitch_cred)
  }
  return live_streams
}

/**
 * Get all channels that the user follows. Uses pagination
 * 
 * Provide `user_id`. Does NOT make a request to fetch the user data.
 */
export async function getFollwedChannelsWithUserId(user_id:string, twitch_cred:TwitchCred) {
  const followed_channels_res = await makeRequest("get", "users/follows", twitch_cred, { params: { from_id: user_id } })
  let followed_channels:any[] = followed_channels_res.data
  let cursor:string|undefined = followed_channels_res.pagination.cursor
  while(true) {
    if(cursor == undefined) break

    const res = await makeRequest("get", "users/follows", twitch_cred, { params: { from_id: user_id, after: cursor } })
    followed_channels = followed_channels.concat(res.data)
    cursor = res.pagination.cursor
  }

  return followed_channels
}

/**
 * Get all live channels. Follows Twitch's implementation of getting multiple multiple channels.
 * 
 * "Pagination" `user_id=user_1&user_id=user_2` allowed upto 100.
 * 
 * This uses different api end point, `stream` and returns a NEW data structure.
 */
export async function getLiveStreamsFromChannelIds(channel_ids:any[], twitch_cred:TwitchCred) {
  const user_id_chunks = _.chunk(channel_ids, 100)
  let live_user_streams:any[] = []

  for(let user_id_chunk of user_id_chunks) {
    const user_ids_param = user_id_chunk.map(user_id => `user_id=${user_id}`).join("&")

    const response = await makeRequest("get", `streams?${user_ids_param}`, twitch_cred)
    live_user_streams = live_user_streams.concat(response.data)
  }

  return live_user_streams
}

/**
 * Genius Twitch won't include the id used in the streamer's channel URL, so have to include that.
 * 
 * This is REQUIRED for non-english channels.
 * 
 * This is because stream API doesn't include USEFUL properties that exist in Users API.
 */
async function attachUserEntity(live_user_streams:any[], twitch_cred:TwitchCred) {
  const user_ids = live_user_streams.map(entry => entry.user_id)
  const user_id_chunks = _.chunk(user_ids, 100)
  let users:any[] = []

  for(let user_id_chunk of user_id_chunks) {
    const user_ids_param = user_id_chunk.map(user_id => `id=${user_id}`).join("&")

    const response = await makeRequest("get", `users?${user_ids_param}`, twitch_cred)
    users = users.concat(response.data)
  }

  live_user_streams = live_user_streams.map(live_stream => {
    const user = users.find(user => user.id == live_stream.user_id)
    live_stream.login = user.login
    live_stream.profile_image_url = user.profile_image_url
    return live_stream
  })

  return live_user_streams
}

/**
 * `game_id=0` is a case where the category or the game is not displayed in the stream.
 * 
 * @param game_id The name of the property is 'game_id' instead of category or something.
 */
async function getCategory(game_id:string, twitch_cred:TwitchCred) {
  const response = await makeRequest("get", "games", twitch_cred, { params: { id: game_id } })
  const res_data = response.data

  let category_name

  /**
   * Handles case where the category isn't displayed. Twitch side bug? Responds properly
   * for `game_id = 0` without throwing error, however.
   */
  if(res_data.length == 0) {
    category_name = ""
  }
  else {
    category_name = res_data[0].name
  }

  return category_name
}