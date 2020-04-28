import axios from "axios"
import moment from "moment"
import { Moment } from "moment"
import * as parser from "fast-xml-parser"
import * as _ from "lodash"

import * as common from "../../common"

type YouTubeVideosResponse = any
type YouTubeVideoChunks = { video_chunks: YouTubeVideosResponse[], max_per_chunk:Number }
type YouTubeChannelResponse = any
export type LatestVideosFromSubscriptions = { channel:YouTubeChannelResponse, videos: YouTubeVideoChunks }

export async function makeRequest(method:string, url:string, access_token:string, req_data?:any) {
  const axios_config:any = {
    headers: { Authorization: `Bearer ${access_token}` },
    baseURL: "https://www.googleapis.com/youtube/v3"
  };

  const _req_data = _.defaultsDeep(req_data, { params: { part: "snippet" } })

  const { data } = await common.makeRequest(method, url, axios_config, _req_data)
  return data
}

/**
 * In my case, I have 200~250 channels I follow. This will only make 4~5 requests.
 * That's 2 quoatas for snippet, multiplied by 4~5 requests which is 8~10 quoatas.
 * 
 *   - https://developers.google.com/youtube/v3/docs/subscriptions/list
 * 
 * @param access_token 
 */
export async function getAllSubscriptions(access_token:string) {
  const params:any = {
    // max value for maxResults: 50.
    maxResults: 50,
    mine: true,
  }

  // Pagination
  let response_data:any = await makeRequest("get", "subscriptions", access_token, { params })
  let all_subscriptions:any[] = response_data.items

  while(true) {
    if(!("nextPageToken" in response_data)) {
      break
    }

    params.pageToken = response_data.nextPageToken

    response_data = await makeRequest("get", "subscriptions", access_token, { params })
    all_subscriptions = all_subscriptions.concat(response_data.items)
  }

  const trimmed_results = all_subscriptions.slice(0, 5)
  console.log(`[/lib/raw-services/youtube][getAllSubscriptions] Loaded ${all_subscriptions.length} subscriptions. Using ${trimmed_results.length} to save quota.`)

  // return all_subscriptions
  return trimmed_results
}

/**
 * Doesn't cost quoata but limited to max 15 entries and no pagination.
 * 
 * Doesn't use YouTube API end point.
 * 
 * Has `links: ["", ""]` which is due to two `<link .../>` XML elements. It's not a bug.
 */
export async function getLatestVideosFromChannelWithXML(channel_id:string) {
  const { data } = await axios.get(`https://www.youtube.com/feeds/videos.xml?channel_id=${channel_id}`)
  const parsed = parser.parse(data)
  return parsed
}

/**
 * Has some restrictions. Refer to comments in `getLatestVideosFromChannelWithXML`
 * 
 * @param access_token 
 */
export async function getLatestVideosFromSubscriptionsWithXML(access_token:string) {
  const subscriptions = await getAllSubscriptions(access_token)
  const _latest_videos = subscriptions.map(async (entry:any) => {
    const channel_id = entry.snippet.resourceId.channelId
    return await getLatestVideosFromChannelWithXML(channel_id)
  })

  /**
   * `{ channel_id: XML parsed: { entries: [Video from this channel] } }`
   */
  const latest_videos = await Promise.all(_latest_videos)

  return latest_videos
}

export type DateRange = { from_moment?:Moment, to_moment?:Moment }

export async function getAllLatestVideosFromDateRanage(access_token:string, date_range:DateRange) {
  const videos_from_subscriptions:LatestVideosFromSubscriptions[] = await getLatestVideosFromSubscriptions(access_token, date_range)

  let all_videos:any[] = []
  for(let vidoes_from_channel of videos_from_subscriptions) {
    vidoes_from_channel.videos.video_chunks.forEach(chunk => all_videos = all_videos.concat(chunk.items))
  }

  return all_videos
}

/**
 * Quoata heavy
 * 
 * @param access_token
 */
export async function getLatestVideosFromSubscriptions(access_token:string, date_range:DateRange):Promise<LatestVideosFromSubscriptions[]> {
  const subscriptions = await getAllSubscriptions(access_token)

  const channel_videos_list = await Promise.all(
    subscriptions.map(async (channel) => {
      const channel_id = channel.snippet.resourceId.channelId
      const videos = await getVideosFromChannelIdWithDateRange(access_token, channel_id, date_range)
      return {
        channel,
        videos
      }
    })
  )

  return channel_videos_list
}

/**
 * NO date range.
 */
export async function getUploadActivities(access_token:string, channel_id:string, params:any) {
  /**
   * https://developers.google.com/youtube/v3/docs/activities/list
   * 
   * Max 50, default 5.
   */
  const maxResults = 10

  const data = await makeRequest("get", "activities", access_token, {
    params: {
      part: "contentDetails",
      channelId: channel_id,
      maxResults
    },
  })

  const video_ids = data.items.filter((item:any) => "upload" in item.contentDetails)
    .map((item:any) => item.contentDetails.upload.videoId)
  
  return video_ids
}

export async function getVideosFromChannelIdWithDateRange(access_token:string, channel_id:string, date_range:DateRange) {
  const activities = await getUploadedVideosFromChannelIdAndDateRange(access_token, channel_id, date_range)
  const video_ids = activities
    .map((item:any) => item.contentDetails.upload.videoId)

  const videos = await getVideosWithVideoIds(access_token, video_ids)
  return videos
}

/**
 * https://developers.google.com/youtube/v3/docs/activities#resource
 * 
 * Activities not only include video uploads, but also comments, likes, and much more. Refer to the
 * description of the "snippet.type" property from the doc above.
 * 
 * This function returns uploaded videos only which include `contentDetails.upload` in the response.
 * Refer to the description of the "contentDetails.upload" property from the doc above.
 * 
 * @param access_token 
 * @param channel_id 
 * @param DateRange
 */
export async function getUploadedVideosFromChannelIdAndDateRange(access_token:string, channel_id:string, { from_moment, to_moment }:DateRange) {
  const data = await makeRequest("get", "activities", access_token, {
    params: {
      part: "contentDetails",
      channelId: channel_id,
      publishedBefore: to_moment!.format(),
      publishedAfter: from_moment!.format()
    },
  })

  try {
    const upload_activities = data.items.filter((item:any) => "upload" in item.contentDetails)
    return upload_activities
  }
  catch(e) {
    console.log(data.items)
    throw e
  }
}

/**
 * Get video entry from video ids.
 * 
 * When used in getting subscription feed, best to extract all video ids from each channel
 * within certain range and use this function to get the video entries.
 * 
 * @param access_token 
 * @param video_ids 
 */
export async function getVideosWithVideoIds(access_token:string, video_ids:string[]):Promise<YouTubeVideoChunks> {
  const maxResults = 50
  /**
   * Make chunks because the `/videos` API only allows upto 50.
   * 
   *   - https://developers.google.com/youtube/v3/docs/videos/list
   */
  const video_id_chunks = _.chunk(video_ids, maxResults)

  const videos = await Promise.all(video_id_chunks.map(async video_id_chunk => {
    const params = {
      part: "snippet",
      id: video_id_chunk.join(","),
    }

    return await makeRequest("get", "videos", access_token, { params })
  }))
  
  return {
    video_chunks: videos,
    max_per_chunk: maxResults
  }
}

/**
 * https://developers.google.com/youtube/v3/docs/commentThreads/list
 * 
 * @param access_token 
 * @param videoId 
 */
export async function getCommentsFromVideo(access_token:string, videoId:string, _params:any) {
  const res_data = await makeRequest("get", "commentThreads", access_token, { params: { videoId, ..._params } })
  const comments = res_data.items
  return comments
}