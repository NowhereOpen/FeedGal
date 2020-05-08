import { ServerSideDataInjection } from "./index"

import * as gystSession from "~/src/server/gyst-server/common/session"

export type SessionServerSideDataInjectionOption = { anon_user_early_quit: boolean }

export abstract class SessionServerSideDataInjection extends ServerSideDataInjection {
  is_logged_in!:boolean
  user_id:null|string = null

  /**
   * 2020-03-07 18:41
   * 
   * Subclasses can override this function to change the behavior.
   */
  getOptions():SessionServerSideDataInjectionOption {
    return { anon_user_early_quit: true }
  }

  /**
   * 2020-03-07 16:50
   * 
   * I don't think the server side data injection needs to throw any error as these
   * injected data will be used on the frontend. So, doing stuff with these data
   * is the responsibility on the frontend.
   */
  onRequestReceived() {
    const options = this.getOptions()

    this.is_logged_in = gystSession.isLoggedin(<any> this.req)
    this.data.is_logged_in = this.is_logged_in

    if(options.anon_user_early_quit && this.is_logged_in == false) {
      this.early_quit = true
      return
    }
    
    if(this.is_logged_in) {
      this.user_id = gystSession.getLoggedInUserId(<any> this.req)
      
      this.data.user_id = this.user_id
    }
  }
}