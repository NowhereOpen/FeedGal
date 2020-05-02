import { SocketEventHandler } from "./base"

import * as gystSession from "~/src/server/lib/session"

export abstract class SessionSocketEventHandler extends SocketEventHandler {
  is_logged_in!:boolean
  user_id:null|string = null
  
  onReceiveRequest() {
    this.is_logged_in = gystSession.isLoggedin({ session: this.session })
    if(this.is_logged_in) {
      this.user_id = gystSession.getLoggedInUserId({ session: this.session })
    }
  }
}