import moment from "moment"

import { GetServiceResponse } from "~/src/gyst/server/base-class/service-module/get-service-response"
import { getAllLatestVideosFromDateRanage } from "~/src/lib/gyst-entries-helper/services/youtube"

export class GetYouTubeServiceResponse extends GetServiceResponse {
  async run() {
    let date_range = this.pagination_value
    const access_token = this.credential

    if(date_range == undefined) {
      date_range = getDefaultDateRange()
    }
    else {
      date_range = {
        from_moment: moment(date_range.from_moment),
        to_moment: moment(date_range.to_moment)
      }
    }

    const result = await getAllLatestVideosFromDateRanage(access_token, date_range)
    return result
  }
}

function getDefaultDateRange() {
  return {
    from_moment: moment().subtract(7, "days"),
    to_moment: moment()
  }
}