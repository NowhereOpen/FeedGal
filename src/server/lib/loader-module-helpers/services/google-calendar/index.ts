import * as _ from "lodash"
import { Moment } from "moment"

import * as common from "../../common"

export async function makeRequest(method:string, url:string, access_token:string, req_data?:any) {
  const axios_config:any = {
    params: { access_token },
    baseURL: "https://www.googleapis.com/calendar/v3"
  };

  const { data } = await common.makeRequest(method, url, axios_config, req_data)
  return data
}

export async function getUserInfo(access_token:string) {
  return await makeRequest("get", "2.0/user", access_token)
}

export async function getCalendars(access_token:string) {
  return await makeRequest("get", "users/me/calendarList", access_token)
}

export async function getAllCalendars(access_token:string) {
  /**
   * https://developers.google.com/calendar/v3/reference/calendarList/list
   * 
   * Max for `maxResults` is 250
   */
  const maxResults = 250
  const res_data = await makeRequest("get", "users/me/calendarList", access_token, { params: { maxResults } })
  let calendars = res_data.items

  let pageToken = res_data.nextPageToken
  while(true) {
    if(pageToken == undefined) {
      break
    }

    const res_data = await makeRequest("get", "users/me/calendarList", access_token, { params: { maxResults, pageToken } })
    const more_calendars = res_data.items
    calendars = calendars.concat(more_calendars)
    pageToken = res_data.nextPageToken
  }

  return calendars
}

/**
 * https://developers.google.com/calendar/v3/reference/events/list
 * 
 * Returns 250 events by default. `maxResults` can't be more than 2500
 * 
 * @param access_token 
 * @param calendar_id 
 */
export async function getEvents(access_token:string, calendar_id:string, params?:any) {
  return await makeRequest("get", `calendars/${calendar_id}/events`, access_token, { params })
}

export async function getCalendar(access_token:string, calendar_id:string) {
  const result = await makeRequest("get", `calendars/${calendar_id}`, access_token)
  return result
}

/**
 * 
 * @param access_token 
 * @param calendar_id The email format calendar id
 */
export async function calendarExists(access_token:string, calendar_id:string) {
  try {
    const result = await getCalendar(access_token, calendar_id)
    return true
  }
  catch(e) {
    /**
     * 2019-12-28 23:36
     * Throw not authenticated error (401) so that `refreshTokenIfFail` can catch it.
     * 
     * 401 error also has valid path to `e.response.data.error.code`. Throw prematurely.
     */
    if(e.response.status == 401) throw e
    
    /**
     * 2019-12-09 12:50
     * 
     * Note that if you are getting an error that doesn't have `response.data.error.code`
     * there must be something wrong with the request itself. `calendars/invalid_calendar_id`
     * responds with `response.data.error`: 
     * 
     *  {
     *    errors: [ { domain: 'global', reason: 'notFound', message: 'Not Found' } ],
     *    code: 404,
     *    message: 'Not Found'
     *  }
     * 
     * I made a mistake of making request to `/calendar/v3/calendar/v3/calendar/...`, the
     * `/calendar/v3` repeated. This request returned 404 error, but it was `e.response.status`
     * and`e.response.data` was just a string.
     */
    if(_.get(e, "response.data.error.code", false)) {
      return false
    }
    
    throw e
  }
}

export type DateRange = { from: Moment, to: Moment }
export async function getEventsWithinRange(access_token:string, date_range:DateRange, calendar_ids:string[]) {
  const _calendar_ids:string[] = calendar_ids.map((calendar_id:string) => {
    /**
     * Fixes holiday calendar ids such as `ko.south_korea#holiday@group.v.calendar.google.com`
     * This results in 404 error, and the `currentURL` omits everything under `#` in axios.
     */
    return encodeURIComponent(calendar_id)
  })

  const range_param = {
    timeMin: date_range.from.format(),
    timeMax: date_range.to.format()
  }

  let events:any[] = []
  for(let calendar_id of _calendar_ids) {
    const _events = await getEvents(access_token, calendar_id, { singleEvents:true, ...range_param })
    events = events.concat(_events.items)
  }

  return events
}

export async function _getEventsWithinRange(access_token:string, date_range:DateRange, calendar_id:string) {
  const _calendar_id = encodeURIComponent(calendar_id)
  
  const range_param = {
    timeMin: date_range.from.format(),
    timeMax: date_range.to.format()
  }

  const events_res_data = await getEvents(access_token, _calendar_id, { singleEvents:true, ...range_param })
  const events = events_res_data.items

  return events
}