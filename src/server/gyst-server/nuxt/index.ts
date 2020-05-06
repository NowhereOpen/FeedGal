import path from "path"
import { RequestHandler } from "express"
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

  // Init Nuxt.js
  nuxt = new Nuxt(config)

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
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