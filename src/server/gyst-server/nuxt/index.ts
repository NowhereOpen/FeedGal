import _ from "lodash"
import path from "path"
import { RequestHandler } from "express"
import { app_settings_reader } from "../../gyst-app-setting-reader"
/**
 * 2020-02-06 07:09
 * 
 * Throws an error when used with `import ... from "nuxt"`, and there is no
 * `@types/nuxt` module when I try to install it.
 * 
 * The `require` method works, however.
 */
const { Nuxt, Builder } = require("nuxt")

export let nuxt_middleware:RequestHandler
export let host:any, port:any
export let nuxt:any
export let nuxt_config:any

export type NuxtSetupReturn = {
  host:any, port:any, nuxt:any, nuxt_config:any, nuxt_middleware:RequestHandler
}

export async function setup(root_to_nuxt_config_fp:string):Promise<NuxtSetupReturn> {
  // Import and Set Nuxt.js options
  const nuxt_config_resolved_path = path.resolve(root_to_nuxt_config_fp)
  const config = require(nuxt_config_resolved_path)
  config.dev = process.env.NODE_ENV !== 'production'

  _.set(config, "server.port", app_settings_reader.getPort())

  // Init Nuxt.js
  nuxt = new Nuxt(config)

  /**
   * 2020-05-20 12:14
   * `await nuxt.ready()` used to be in `else` statement after `if(config.dev)` but this was
   * updated in the recent nuxt app template created with `npx create-nuxt-app`. Without
   * this the nuxt app wasn't able to recognize ts files in `/store`. It works now with this
   * one line code change.
   */
  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  const { host: _host, port: _port } = nuxt.options.server

  host = _host
  port = _port
  nuxt_middleware = nuxt.render
  nuxt_config = config

  return {
    host, port, nuxt_middleware, nuxt_config, nuxt
  }
}