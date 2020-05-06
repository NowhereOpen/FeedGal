import { Server as WSServer, Socket } from "socket.io"

import { GystEntriesInitSocketHandler } from "~/src/server/gyst-server/ws-server-socket-handler-collection/socket-handlers/gyst-entries-init"
import { GystEntriesWithPaginationSocketHandler } from "~/src/server/gyst-server/ws-server-socket-handler-collection/socket-handlers/gyst-entries-pagination"

export function setup(ws_server:WSServer) {
  ws_server.on("connection", (socket:Socket) => {
    socket.on("gyst-entries-init", (req:any, ack:Function) => new GystEntriesInitSocketHandler(req, ack, socket).handle())
    socket.on("gyst-entries-pagination", (req:any, ack:Function) => new GystEntriesWithPaginationSocketHandler(req, ack, socket).handle())
  })
}