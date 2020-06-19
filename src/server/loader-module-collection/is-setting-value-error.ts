import * as GithubLib from "~/src/server/loader-module-collection/loader-modules/github"
import * as GoogleCalendarLib from "~/src/server/loader-module-collection/loader-modules/google-calendar"
import * as LeagueOfLegendsLib from "~/src/server/loader-module-collection/loader-modules/league-of-legends"

/**
 * Expect that `service_id` is that of services that use setting value
 * 
 * Some services don't use Axios to get response like Twitter, but twitter doesn't
 * use setting value, BUT we rely on the implementation `isSettingValueError` of
 * each service that provide the function.
 * 
 * @param service_id 
 * @param e 
 */
export function isSettingValueError(service_id:string, e:any):boolean {
  if(service_id == "github") {
    return GithubLib.isSettingValueError(e)
  }
  else if(service_id ==  "google-calendar") {
    return GoogleCalendarLib.isSettingValueError(e)
  }
  else if(service_id == "league-of-legends") {
    return LeagueOfLegendsLib.isSettingValueError(e)
  }

  console.error(`Service id ${service_id} is not registered for 'isSettingValueError'.`)
  throw Error("Unknown service_id for `isSettingValueError`")
}