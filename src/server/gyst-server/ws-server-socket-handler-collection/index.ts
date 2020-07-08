import { Server as WSServer, Socket } from "socket.io"

import { SocketEventHandler } from "~/src/server/gyst-server/ws-server-socket-handler-collection/socket-handler-base/base"

import { GystEntriesInitSocketHandler } from "~/src/server/gyst-server/ws-server-socket-handler-collection/socket-handlers/gyst-entries-init"
import { GystEntriesWithPaginationSocketHandler } from "~/src/server/gyst-server/ws-server-socket-handler-collection/socket-handlers/gyst-entries-pagination"

/**
 * 2020-07-08 16:55
 * 
 * Refer to comment 2020-07-08 16:18 in:
 * 
 *   - src/server/gyst-server/express-server-endpoint-collection/index.ts
 * 
 * In case of websocket, it's easy to believe that it works withou this 'factory' pattern because
 * the callback function passed to `ws_server.on("connection", cb)` gets executed again on
 * refreshing. In case of express end points, this didn't re-instantiated the wrongly-implemented
 * endpoint instances, but in this case, it does.
 * 
 * In case of websocket, the 'user scope' is kept safe, but it's still important to keep each
 * request fresh when I don't need them to keep stuff from the last request.
 * 
 * In case of websocket, debug with the pagination event handler instead of the init. The
 * pagination event handler shouldn't keep any properties from the last event.
 */
function handleFactory(socket:Socket, makeInstance:() => SocketEventHandler) {
  return async (req:any, ack:Function) => {
    const inst = makeInstance()
    await inst.handle(req, ack, socket)
  }
}

export function setup(ws_server:WSServer) {
  ws_server.on("connection", (socket:Socket) => {
    socket.on("gyst-entries-init", handleFactory(socket, () => new GystEntriesInitSocketHandler()))
    socket.on("gyst-entries-pagination", handleFactory(socket, () => new GystEntriesWithPaginationSocketHandler()))
  })
}