import moment from "moment"

import { LoaderModuleOutput, PaginationOptions, Entry } from "~/src/server//loader-module-collection/loader-module-base/types"
import { getAllLatestVideosFromDateRanage, DateRange } from "~/src/server/lib/loader-module-helpers/services/youtube"

export async function getEntries(access_token:string, pagiantion_index:number, date_range:DateRange):Promise<LoaderModuleOutput> {
  const result = await getAllLatestVideosFromDateRanage(access_token, date_range)

  return {
    entries: result.map(formatEntries),
    pagination_options: getPaginationData(pagiantion_index, date_range)
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

function getPaginationData(pagination_index:number, prev_pagination_value?:any):PaginationOptions {
  let date_range

  if(pagination_index == 0) {
    date_range = {
      from_moment: moment().subtract(7, "days"),
      to_moment: moment()
    }
  }
  else {
    date_range = {
      from_moment: moment(prev_pagination_value["from_moment"]),
      to_moment: moment(prev_pagination_value["to_moment"]),
    }
  }

  return {
    new: {
      from_moment: date_range.to_moment,
      to_moment: date_range.to_moment.clone().add(7, "days")
    },
    old: {
      to_moment: date_range.from_moment,
      from_moment: date_range.from_moment.clone().subtract(7, "days")
    }
  }
}