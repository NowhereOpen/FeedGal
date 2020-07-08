import * as gystSession from "~/src/server/gyst-server/common/session"
import { MUST_BE_ANON_USER, MUST_BE_LOGGED_IN } from "~/src/common/warning-error"

import { ExpressRequest } from "./base"

// Types
import { ErrorObject } from "~/src/common/types/common/warning-error"

export enum UserType { USER_ONLY, ANON_ONLY, BOTH }

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

  user_type:UserType 

  constructor(user_type:UserType) {
    super()
    this.user_type = user_type
  }

  onReceiveRequest() {
    this.is_logged_in = gystSession.isLoggedin(<any> this.req)
    if(this.is_logged_in) {
      this.user_id = gystSession.getLoggedInUserId(<any> this.req)
    }

    if(this.user_type == UserType.ANON_ONLY && this.is_logged_in) {
      this.sendError(403, MUST_BE_ANON_USER())
      return
    }
    else if(this.user_type == UserType.USER_ONLY && this.is_logged_in == false) {
      this.sendError(403, MUST_BE_LOGGED_IN())
      return
    }
    else if(this.user_type == UserType.BOTH) {
      // Doesn't throw any error
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

  storeDataForSignup(service_id:string, user_info:gystSession.UserInfo, token_data:any) {
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