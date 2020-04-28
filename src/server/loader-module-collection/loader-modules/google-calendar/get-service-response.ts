import moment from "moment"

import { GetServiceResponse } from "~/src/gyst/server/base-class/service-module/get-service-response"
import { _getEventsWithinRange } from "~/src/lib/gyst-entries-helper/services/google-calendar"

export class GetGoogleCalendarServiceResponse extends GetServiceResponse {
  async run() {
    const access_token = this.credential
    const { calendar_id } = this.req_params
    let date_range = this.pagination_value

    if(date_range == undefined) {
      date_range = getDefaultDateRange()
    }
    else {
      date_range = {
        from: moment(date_range.from),
        to: moment(date_range.to)
      }
    }
  
    const entries:any[] = await _getEventsWithinRange(access_token, date_range, calendar_id)
    return entries
  }
}

function getDefaultDateRange() {
  return {
    from: moment().startOf("week"),
    to: moment().endOf("week"),
  }
}