import _ from "lodash"

/**
 * 2020-06-19 11:19
 * 
 * 404 for invalid summoner name.
 * 
 * Request error(?) if invalid region, which is included in the url hostname.
 * 
 * Don't know about other values. Note that there are two setting values:
 * 
 *   - summoner name
 *   - region
 * 
 * And region is selected by `v-select`
 * 
 * @param e 
 */
export function isSettingValueError(e:any):boolean {
  return _.get(e, "response.status", undefined) == 404
}