import express from "express"
import http from "http"

import { setup as setupExpressServer } from "./express-server"
import { setup as setupNativeServer, HttpsCreds } from "./native-server"
import { setup as setupNuxt } from "./nuxt"
import { setup as setupWSServer } from "./ws-server"
import { setup as setupSessionMiddleware } from "./middlewares/session"

import { setup as setupEndpoints } from "./express-server-endpoint-collection"
import { setup as setupSocketHandlers } from "./ws-server-socket-handler-collection"
import { setup as setupServerSideInjections } from "./server-side-data-injection-collection/setup"

export type ServerSettings = {
  protocol: "http"|"https"
  session_secret: string
  https_creds?:HttpsCreds
  is_public: boolean
}

export async function runServer(server_settings:ServerSettings, root_to_nuxt_config_fp:string) {
  let protocol = server_settings.protocol
  const session_secret = server_settings.session_secret
  const https_creds = server_settings.https_creds
  const is_public = server_settings.is_public

  if(is_public) {
    console.log("The server is running for public use. Nuxt server will run on '0.0.0.0'.")
    process.env.NUXT_HOST = "0.0.0.0"
  }

  const { nuxt_middleware, nuxt, port, host } = await setupNuxt(root_to_nuxt_config_fp)
  const session_middleware = setupSessionMiddleware(session_secret)
  const express_server = setupExpressServer(session_middleware)

  if(is_public) {
    protocol = "https"
  }

  const native_server = setupNativeServer(protocol, express_server, https_creds)
  const socket_server = setupWSServer(native_server, session_middleware)

  setupEndpoints(express_server)
  setupSocketHandlers(socket_server)

  express_server.use(nuxt_middleware)

  /**
   * MUST be done after running the nuxt server `runNuxtServer`, else
   * the route will return as it is instead of `/foo/_bar?` something like this.
   */
  setupServerSideInjections(nuxt)

  if(is_public) {
    console.log("The server is running for public use. Setting up 'http to https redirect'.")
    native_server.listen(443, host)
    console.log("Public https server running on port 443.")
    setupRedirectMiddleware()
  }
  else {
    native_server.listen(port, host)
    console.log(`Server listening to port (${port}) on host (${host})`)
  }
}

function setupRedirectMiddleware() {
  const app = express()
  /**
   * Redirect http to https (https://stackoverflow.com/a/49176816)
   */
  app.use((req, res, next) => {
    // request was via http, so redirect to https
    res.redirect('https://' + req.headers.host + req.url);
  })

  const redirect_app = http.createServer(app)
  redirect_app.listen(80)
  console.log("Public http to https redirect server running on port 80.")
}