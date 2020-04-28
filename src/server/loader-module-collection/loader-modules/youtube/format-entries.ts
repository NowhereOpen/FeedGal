import { GystEntry } from "~/src/gyst/common/types/gyst-entry"

export function formatEntries(video:any):GystEntry {
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