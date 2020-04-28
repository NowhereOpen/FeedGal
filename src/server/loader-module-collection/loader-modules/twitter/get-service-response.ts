import { GetServiceResponse } from "~/src/gyst/server/base-class/service-module/get-service-response"
import { getHomeTimeline } from "~/src/lib/gyst-entries-helper/services/twitter"

export class GetTwitterServiceResponse extends GetServiceResponse {
  async run() {
    const twitter_cred = this.credential
    
    let pagination_param = undefined
    const direction = this.pagination_direction
    const value = this.pagination_value
    if(direction == "old") {
      pagination_param = { max_id: value }
    }
    else if(direction == "new") {
      pagination_param = { since_id: value }
    }

    let home_timeline_tweets = await getHomeTimeline(twitter_cred, pagination_param)

    if(this.pagination_direction == "old") {
      home_timeline_tweets.shift()
    }

    return home_timeline_tweets
  }
}