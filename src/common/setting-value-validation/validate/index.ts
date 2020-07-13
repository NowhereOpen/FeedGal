/**
 * 2020-07-07 16:50
 * 
 * ONLY common validate functions MUST be defined here.
 * 
 * Server side only validate functions such as validating using response and its
 * status property can only done be on the server side.
 * 
 * The purpose of this library is so that the exact same function can be used
 * on the client and server side.
 * 
 * Validations should be done on the both side because (1) doing it only on the
 * server side will make user wait unnecessarily, especially when relying on 
 * server side only validations. (2) when doing it only on client side, we are
 * defying "never trust the client" rule. Don't want any errors due to the client
 * using the 'internal API' in a silly way.
 * 
 * And therefore, it's only logical to validate on both server side and client
 * side. And having this library helps not having to define the same logic on
 * both sides.
 * 
 * Again, there ARE definitely server-side-only validations and they don't go
 * into this library.
 */

import * as Github from "./github"
import * as GoogleCalendar from "./google-calendar"
import * as LeagueOfLegends from "./league-of-legends"
import * as Rss from "./rss"
import { invalid } from "moment"

export { Github, GoogleCalendar, LeagueOfLegends, Rss }
export * from "./utility"
