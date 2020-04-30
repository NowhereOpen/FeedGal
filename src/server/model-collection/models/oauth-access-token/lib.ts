import moment from "moment"

export function isValid(time_info:any) {
  let valid_checkers = [
    { value: time_info.invalid_at, name: "invalid", is_valid: false },
    { value: time_info.refreshed_at, name: "refreshd", is_valid: true },
    { value: time_info.retrieved_at, name: "retrieved", is_valid: true },
  ]
  valid_checkers = valid_checkers.filter(entry => entry.value != undefined)
  valid_checkers = valid_checkers.sort((a:any, b:any) => {
    return moment(b.value).diff(moment(a.value))
  })
 
  const is_valid = valid_checkers[0].is_valid
  return is_valid
 }