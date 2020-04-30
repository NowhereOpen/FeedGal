import * as gystSession from "~/src/server/lib/session"

import { ExpressRequest } from "./base"

/**
 * 2020-03-07 16:48
 * This class can definitely have an option for "allow-anon-user-only" or "allow-logged-in-user-only"
 * or something, but I think it's better to use middlewares instead at the moment.
 * 
 * PLEASE do update this otherwise.
 */
export abstract class SessionRequestHandlerBase extends ExpressRequest {
  is_logged_in!:boolean
  user_id:null|string = null

  onReceiveRequest() {
    this.is_logged_in = gystSession.isLoggedin(<any> this.req)
    if(this.is_logged_in) {
      this.user_id = gystSession.getLoggedInUserId(<any> this.req)
    }
  }

  loginUser(user_id:string) {
    return gystSession.loginUser(<any> this.req, user_id)
  }

  getLoggedInUserid() {
    return gystSession.getLoggedInUserId(<any> this.req)
  }

  isLoggedIn() {
    return gystSession.isLoggedin(<any> this.req)
  }

  logout() {
    return gystSession.logout(<any> this.req)
  }

  storeDataForSignup(service_id:string, user_info:UserInfo, token_data:any) {
    return gystSession.storeDataForSignup(<any> this.req, service_id, user_info, token_data)
  }

  getDataForSignup():gystSession.DataForSignup {
    return gystSession.getDataForSignup(<any> this.req)
  }

  clearDataForSignup() {
    return gystSession.clearDataForSignup(<any> this.req)
  }

  isSigningUp() {
    return gystSession.isSigningUp(<any> this.req)
  }
}