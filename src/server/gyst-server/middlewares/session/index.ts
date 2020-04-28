import { RequestHandler } from "express"
import session from "express-session"

export let session_middleware:RequestHandler

export function setup(secret:string) {
  session_middleware = session({
    secret: secret,
    /**
     * Default is true but the doc says using the default is deprecated.
     * 
     * 2019-12-08 11:07 Fixes a weird bug where logging out removes
     * "logged in" indicator but refreshing the page brings it back.
     * Honestly need another case where using this option causes some
     * trouble.
     */
    resave: false
  })

  return session_middleware
}