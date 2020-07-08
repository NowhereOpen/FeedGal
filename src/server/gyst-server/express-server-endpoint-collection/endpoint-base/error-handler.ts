import { Request, Response, NextFunction } from "express"

import { ExpressRequest } from "~/src/server/gyst-server/express-server-endpoint-collection/endpoint-base/base"

export class ErrorHandler extends ExpressRequest {
  error:any
  storeParams() {}

  constructor(error:any) {
    super()
    this.error = error
  }

  async doTasks():Promise<void> {
    /**
     * 2020-07-04 03:19
     * Store error to fix later.
     * 
     * Could store the error with id, and send the id to the response so that
     * the user only needs to share this id.
     */
    console.log(this.error)
    console.log(`Express error handler caught the above error.`)

    this.res.status(500).send({
      status: 500,
      name: "DEV_FAULT",
      message: "Developer forgot to handle this error. Sorry."
    })
  }
}