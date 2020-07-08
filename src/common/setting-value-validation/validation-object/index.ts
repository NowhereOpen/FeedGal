/**
 * 2020-07-07 16:58
 * 
 * ValidationObjects whether 'common' or 'server side only', everything is
 * defined here. Validation Object that's returned by server side only
 * validate function is defined here because the client side will have to
 * understand the validation object returned by the server side only validate
 * function.
 */

import * as Github from "./github"
import * as GoogleCalendar from "./google-calendar"
import * as LeagueOfLegends from "./league-of-legends"
import * as Common from "./common"

export { Github, GoogleCalendar, LeagueOfLegends, Common }