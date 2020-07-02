import moment from "moment"

import { LoaderModuleOutput, PaginationData, Entry } from "~/src/server//loader-module-collection/loader-module-base/types"
import { getAllLatestVideosFromDateRanage, DateRange } from "~/src/server/lib/loader-module-helpers/services/youtube"

export async function getEntries(access_token:string, date_range:DateRange):Promise<LoaderModuleOutput> {
  const result = await getAllLatestVideosFromDateRanage(access_token, date_range)

  return {
    entries: result.map(formatEntries),
    pagination_data: getPaginationData(date_range)
  }
}

function formatEntries(video:any):Entry {
  return {
    service_id: "youtube",
    id: video.id,
    title: video.snippet.title,
    content: video.snippet.description,
    datetime_info: video.snippet.publishedAt,
    contexts: [
      { name: "YouTube", url: `https://youtube.com` },
      { name: video.snippet.channelTitle, url: `https://www.youtube.com/channel/${video.snippet.channelId}` },
      { name: "Video", url: `https://youtube.com/watch?v=${video.id}` }
    ],
    resources: {
      main: { type: "img", value: video.snippet.thumbnails.medium.url }
    },
    json_content: video,
  }
}

function getPaginationData(prev_pagination_value:DateRange):PaginationData {
  return {
    new: {
      from_moment: prev_pagination_value.to_moment,
      to_moment: prev_pagination_value.to_moment.clone().add(7, "days")
    },
    old: {
      to_moment: prev_pagination_value.from_moment,
      from_moment: prev_pagination_value.from_moment.clone().subtract(7, "days")
    }
  }
}