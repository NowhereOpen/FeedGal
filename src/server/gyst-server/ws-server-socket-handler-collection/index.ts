import { Server as WSServer, Socket } from "socket.io"

import { GystEntriesInitSocketHandler } from "~/src/server/gyst-server/ws-server-socket-handler-collection/socket-handlers/gyst-entries-init"
import { GystEntriesWithPaginationSocketHandler } from "~/src/server/gyst-server/ws-server-socket-handler-collection/socket-handlers/gyst-entries-pagination"

export function setup(ws_server:WSServer) {
  ws_server.on("connection", (socket:Socket) => {
    socket.on("gyst-entries-init", new GystEntriesInitSocketHandler().handler(socket))
    socket.on("gyst-entries-pagination", new GystEntriesWithPaginationSocketHandler().handler(socket))
  })
}