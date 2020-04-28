import express from "express"
import { RequestHandler } from "express"
import { Application } from "express"
import bodyParser from "body-parser"

export let express_app:Application

export function setup(protocol:"https"|"http", session_middleware:RequestHandler) {
  express_app = express()

  if(protocol == "https") {
    console.log("Using https protocol. Setting up http to https redirect middleware.")
    setupRedirectMiddleware(express_app)
  }

  express_app.use(bodyParser.json())
  express_app.use(session_middleware)

  return express_app
}

function setupRedirectMiddleware(app:Application) {
  /**
   * Redirect http to https (https://stackoverflow.com/a/49176816)
   */
  app.use((req, res, next) => {
    if (req.secure) {
      // request was via https, so do no special handling
      next();
    } else {
      // request was via http, so redirect to https
      res.redirect('https://' + req.headers.host + req.url);
    }
  })
}