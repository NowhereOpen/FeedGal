import express from "express"
import { RequestHandler } from "express"
import { Application } from "express"
import bodyParser from "body-parser"

export let express_app:Application

export function setup(session_middleware:RequestHandler) {
  express_app = express()

  express_app.use(bodyParser.json())
  express_app.use(session_middleware)

  return express_app
}