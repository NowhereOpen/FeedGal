import http from "http"
import { RequestListener } from "http"
import https from "https"

export let native_server:http.Server|https.Server

export type HttpsCreds = { key: string, cert: string }

export function setup(protocol:string, request_handler:RequestListener, https_creds?:HttpsCreds) {
  if(protocol == "http") {
    native_server = http.createServer(request_handler)
  }
  else if(protocol == "https") {
    native_server = https.createServer(https_creds!, request_handler)
  }

  return native_server
}