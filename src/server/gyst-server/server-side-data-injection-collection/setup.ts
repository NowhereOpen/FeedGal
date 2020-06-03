import * as _ from "lodash"
import Vue from "vue"
import VueRouter from "vue-router"

import * as gystSession from "~/src/server/gyst-server/common/session"

import { inject as injectPageLogin } from "~/src/server/gyst-server/server-side-data-injection-collection/injections/page-login"
import { inject as injectLoader } from "~/src/server/gyst-server/server-side-data-injection-collection/injections/loader"
import { inject as injectPageSettingsAccounts } from "~/src/server/gyst-server/server-side-data-injection-collection/injections/page-settings-accounts"
import { inject as injectPageSuite } from "~/src/server/gyst-server/server-side-data-injection-collection/injections/page-suite"

/**
 * Refer to http://localhost:3030/t/getting-a-matched-path-with-nuxt/2271
 */
export function setup(nuxt:any) {
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
    const { req, url }:{ req:any, url:any } = renderContext
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

    await injectData(matched_path, req, renderContext.nuxt.state)
  })
}

/**
 * 2020-05-21 16:39 
 * 
 * Data injection is done by directly modifying the Vuex state. This is possible by passing
 * `stateFactory: false` to vuex-module-decorators `@Module` decorator, and will have the
 * same effect as having `const state = { ... }` instead of `const state = () => ({ ... })`.
 * 
 * Nuxt Vuex `nuxtServerInit` action doesn't work properly and will cause the client side to
 * throw syntax error because it attempts to read the server side code on the client side.
 */
async function injectData(matched_path:string, req:any, state:any) {
  const is_logged_in = gystSession.isLoggedin(<any> req)
  let user_id:string|undefined
  if(is_logged_in) {
    user_id = gystSession.getLoggedInUserId(<any> req)
  }

  // Common handler
  injectAllPage(state["session"], is_logged_in, user_id)

  // Page handler
  if(matched_path == "" && is_logged_in) {
    await injectLoader(state["loader"], user_id!)
  }
  else if(matched_path == "/login") {
    await injectPageLogin(state["page-login"], is_logged_in, user_id)
  }
  else if(matched_path == "/suite" && is_logged_in) {
    await injectPageSuite(state["page-suite"], user_id!)
  }
  else if(matched_path == "/settings/accounts" && is_logged_in) {
    await injectPageSettingsAccounts(state["page-settings-accounts"], user_id!)
  }
}

function injectAllPage(state:any, is_logged_in:boolean, user_id:undefined|string) {
  state.is_logged_in = is_logged_in
  state.user_id = user_id
}