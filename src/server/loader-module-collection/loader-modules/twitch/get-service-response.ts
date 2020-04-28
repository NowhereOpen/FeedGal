import { GetServiceResponse } from "~/src/gyst/server/base-class/service-module/get-service-response"
import { getLiveFollowedChannelsByUserId } from "~/src/lib/gyst-entries-helper/services/twitch"

export class GetTwitchServiceResponse extends GetServiceResponse {
  async run() {
    if(this.pagination_index > 0) {
      return []
    }
    
    const access_token = this.credential

    const live_channels = await getLiveFollowedChannelsByUserId(access_token)
    return live_channels
  }
}