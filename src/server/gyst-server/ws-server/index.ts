import socketio from "socket.io"
import sharedSession from "express-socket.io-session"
import { Server as WSServer } from "socket.io"
import { Server as NativeServer } from "http"
import { RequestHandler } from "express"

export let io:WSServer

export function setup(native_server:NativeServer, session_middleware:RequestHandler) {
  io = socketio(native_server)
  // https://stackoverflow.com/a/25618636
  io.use(sharedSession(session_middleware, { autoSave: true }))

  return io
}