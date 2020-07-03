import { Request, Response, Handler, ErrorRequestHandler } from "express"

import { ErrorName, ErrorObject } from "~/src/common/types/common/warning-error"

export abstract class ExpressRequest {
  req!:Request
  res!:Response
  
  constructor() {}

  res_data:any = {}

  /**
   * 2020-03-25 19:27
   * 
   * Callback
   */
  onReceiveRequest():void|Promise<void> {}
  /**
   * 2020-03-25 19:28
   * 
   * Store and validate (if needed) parameters into fields of subclass.
   * Use `sendError` if needed.
   */
  abstract storeParams():void|Promise<void>
  /**
   * 2020-03-25 19:29
   * 
   * Should store data in `res_data`. Could validate response data from
   * this method.
   * Use `sendError` if needed.
   */
  abstract doTasks():void|Promise<void>
  /**
   * 2020-03-25 19:29
   * 
   * Returned value will be directly sent as response
   * 
   * Could validate response data from here. Use `sendError` if needed.
   */
  async getResponse():Promise<any> {
    return this.res_data
  }

  /**
   * 2020-03-25 19:33
   * 
   * Used to have `prematureExit` and throw a `KnownError` class that `handle`
   * understands which will be send into an error. But instead, use this method
   * to send error, or use `this.res` directly (when redirecting) then check for
   * `this.res.headersSent` between each step.
   */
  sendError(status:number, name:ErrorName, message:string, data?:any) {
    const error_data = {
      error: <ErrorObject> {
        name, message
      },
      data
    }

    this.res.status(status).send(error_data)
  }

  handler():Handler|ErrorRequestHandler {
    return async (req:Request, res:Response) => {
      this.req = req
      this.res = res
      return await this.handle()
    }
  }

  async handle() {
    await this.onReceiveRequest()

    if(this.res.headersSent) {
      return
    }

    await this.storeParams()
    
    if(this.res.headersSent) {
      return
    }

    await this.doTasks()

    if(this.res.headersSent) {
      return
    }

    const res_data = await this.getResponse()

    return this.res.send(res_data)
  }
}