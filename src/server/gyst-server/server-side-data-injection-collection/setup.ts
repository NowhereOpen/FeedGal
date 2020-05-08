import * as _ from "lodash"
import Vue from "vue"
import VueRouter from "vue-router"

import { MatchPathFunc, ServerSideDataInjection } from "./base"

import { MatchAllPath, SessionInfoInjection } from "./injections/match-all/inject-session-info"

import { LoginPageMatchPath, LoginPageInjection } from "./injections/page-login"
// import { MainPageMatchPath, MainPageInjection } from "./injections/page-main"
// import { SettingsGystSuitesPageMatchPath, SettingsGystSuitesPageInjection } from "./injections/page-settings-gyst-suites"
// import { SettingsUsersPageMatchPath, SettingsUserPageInjection } from "./injections/page-settings-user"
// import { SettingsConnectNewAccountMatchPath, SettingsConnectNewAccountPageInjection } from "./injections/page-settings-connect-new-account"
// import { UsersPageMatchPath, UserPageInjection } from "./injections/page-user"

interface ServerSideDataInjectionClass { new(...args:any[]): ServerSideDataInjection }

const collection:[MatchPathFunc, ServerSideDataInjectionClass][] = []

/**
 * Refer to http://localhost:3030/t/getting-a-matched-path-with-nuxt/2271
 */
export function setup(nuxt:any) {
  setupMatchPathFunctions()

  const router_copy = _.cloneDeep(nuxt.options.router)
  router_copy.routes.forEach((route:any) => {
    route.component = new Vue()
  })
  const vue_router = new VueRouter(router_copy)

  /**
   * 2020-03-01 21:57
   * 
   * Refer to:
   * 
   *   - https://github.com/nuxt/nuxt.js/blob/a3fdba885e43a76ad605f21d0cfe95038b2681a2/packages/server/src/middleware/nuxt.js#L7
   *     - Adds req & res
   *   - https://github.com/nuxt/nuxt.js/blob/a3fdba885e43a76ad605f21d0cfe95038b2681a2/packages/vue-renderer/src/renderer.js#L241
   *     - Adds url, spa, modern, etc
   * 
   * for structure of renderContext
   */
  nuxt.hook('vue-renderer:ssr:context', async function(renderContext:any) {
    const url = renderContext.url
    const result = vue_router.resolve(url)
    const matched = result.route.matched

    /**
     * 2020-03-06 13:02
     * 
     * This is the case for 404 error. Exit early to prevent an error message in the terminal.
     * This applies to 404 for both front and back endpoints.
     */
    if(matched.length == 0) return

    /**
     * 2020-03-01 21:33
     * 
     * The `matched` property is not documented in https://router.vuejs.org/api/#router-resolve
     * as of now
     */
    const matched_path = matched[0].path

    await injectData(matched_path, renderContext)
  })
}

/**
 * 2020-03-07 20:44
 * 
 * Should MatchPath function be included as a part of DataInjection class?
 * 
 * The data injection doesn't use any of the url information when injecting data.
 * Even if they do, it can be retrieved from the frontend by simply calling `document.location`.
 * 
 * So, I'm not taking this appproach any further than this. Not including "match path" into the
 * DataInjection classes for now.
 */
function setupMatchPathFunctions() {
  collection.push([LoginPageMatchPath, LoginPageInjection])
  // collection.push([SettingsGystSuitesPageMatchPath, SettingsGystSuitesPageInjection])
  // collection.push([SettingsUsersPageMatchPath, SettingsUserPageInjection])
  // collection.push([SettingsConnectNewAccountMatchPath, SettingsConnectNewAccountPageInjection])
  // collection.push([MainPageMatchPath, MainPageInjection])
  // collection.push([UsersPageMatchPath, UserPageInjection])
}

async function injectData(matched_path:string, renderContext:any) {
  let not_matched = true

  await Promise.all(
    collection.map(async ([match_path_function, DataInjection]) => {
      const is_match = match_path_function(matched_path)
      if(is_match) {
        console.log(`[server-side-data-injection] Match exists for matched path '${matched_path}': ${DataInjection.name}`)
        not_matched = false
        const inst = new DataInjection(renderContext)
        await inst.injectData()
      }
    })
  )

  if(not_matched) {
    console.log(`[server-side-data-injection] No injection module exists for matched_path ${matched_path}`)
    return
  }
}