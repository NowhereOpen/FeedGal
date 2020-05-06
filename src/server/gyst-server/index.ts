import { setup as setupExpressServer } from "./express-server"
import { setup as setupNativeServer, HttpsCreds } from "./native-server"
import { setup as setupNuxt } from "./nuxt"
import { setup as setupWSServer } from "./ws-server"
import { setup as setupSessionMiddleware } from "./middlewares/session"

import { setup as setupEndpoints } from "./express-server-endpoint-collection"
import { setup as setupSocketHandlers } from "./ws-server-socket-handler-collection"
import { setup as setupServerSideInjections } from "./nuxt-server-side-injection-collection"

export type ServerSettings = {
  protocol: "http"|"https"
  session_secret: string
  https_creds?:HttpsCreds
}

export async function runServer(server_settings:ServerSettings, root_to_nuxt_config_fp:string) {
  const protocol = server_settings.protocol
  const session_secret = server_settings.session_secret
  const https_creds = server_settings.https_creds

  const { nuxt_middleware, nuxt, port, host } = await setupNuxt(root_to_nuxt_config_fp)
  const session_middleware = setupSessionMiddleware(session_secret)
  const express_server = setupExpressServer(protocol, session_middleware)

  const native_server = setupNativeServer(protocol, express_server, https_creds)
  const socket_server = setupWSServer(native_server, session_middleware)

  express_server.use(nuxt_middleware)

  /**
   * MUST be done after running the nuxt server `runNuxtServer`, else
   * the route will return as it is instead of `/foo/_bar?` something like this.
   */
  setupServerSideInjections(nuxt)

  setupEndpoints(express_server)
  setupSocketHandlers(socket_server)

  native_server.listen(port, host)
}