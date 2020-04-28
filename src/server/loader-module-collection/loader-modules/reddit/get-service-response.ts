import { GetServiceResponse } from "~/src/gyst/server/base-class/service-module/get-service-response"
import * as Reddit from "~/src/lib/gyst-entries-helper/services/reddit"

export class GetRedditServiceResponse extends GetServiceResponse {
  async run() {
    const reddit_cred = this.credential

    let pagination_param = undefined
    const direction = this.pagination_direction
    const value = this.pagination_value
    if(direction == "old") {
      pagination_param = { after: value }
    }
    else if(direction == "new") {
      pagination_param = { before: value }
    }

    const result = await Reddit.getBestListing(reddit_cred, pagination_param)
    return result
  }
}