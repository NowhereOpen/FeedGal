import _ from "lodash"
export function isSettingValueError(e:any):boolean {
  /**
   * 2020-06-19 11:08
   * 
   * 404 error for `/commits` API isn't documented.
   * 
   * Throws 404 when either :owner and :repo are invalid.
   * 
   * Not supporting other branches than `master` at the moment.
   */
  return _.get(e, "response.status", undefined) == 404
}