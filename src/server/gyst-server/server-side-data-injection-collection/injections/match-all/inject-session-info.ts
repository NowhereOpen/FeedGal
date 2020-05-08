/**
 * 2020-03-07 21:19
 * 
 * Can't find where this is used. For data injection classes that need session information,
 * they can just extend the `SessionServerSideDataInjection` class.
 */

import { MatchPathFunc } from "~/src/gyst/server/base-class/server-side-data-injection"
import { SessionServerSideDataInjection } from "~/src/gyst/server/base-class/server-side-data-injection/session"

export class SessionInfoInjection extends SessionServerSideDataInjection {
  async loadData() {}
}

/**
 * Match all
 */
export const MatchAllPath:MatchPathFunc = (matched_path) => {
  return true
}