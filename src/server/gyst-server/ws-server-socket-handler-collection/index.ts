import { Server as WSServer } from "socket.io"

import { socket_handler as gyst_entries_init } from "~/src/server/gyst-server/ws-server-socket-handler-collection/socket-handlers/gyst-entries-init"
import { socket_handler as gyst_entries_pagination } from "~/src/server/gyst-server/ws-server-socket-handler-collection/socket-handlers/gyst-entries-pagination"

export function setup(ws_server:WSServer) {
  ws_server.on("gyst-entries-init", gyst_entries_init)
  ws_server.on("gyst-entries-pagination", gyst_entries_pagination)
}