import _ from "lodash"

/**
 * https://developers.google.com/calendar/v3/errors#404_not_found
 */
export function isSettingValueError(e:any):boolean {
  return _.get(e, "response.status", undefined) == 404
}