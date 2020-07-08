import _ from "lodash"

import { SessionRequestHandlerBase } from "~/src/server/gyst-server/express-server-endpoint-collection/endpoint-base/session"
import { service_setting_storage } from "~/src/server/model-collection/models/service-setting"
import { GetGoogleCalendars } from "~/src/server/method-collection/oauth"

import { GOOGLE_AUTHORIZATION_ERROR } from "~/src/common/warning-error"

// Types
import { ErrorObject } from "~/src/common/types/common/warning-error"

export class GetGoogleCalendarsRequestHandler extends SessionRequestHandlerBase {
  service_setting_id!:string

  storeParams():void|Promise<void> {
    this.service_setting_id = this.req.params.service_setting_id
  }

  async doTasks():Promise<void> {
    const oauth_user_entry_id:string = await service_setting_storage.getOAuthConnectedUserEntryId(this.service_setting_id)
    
    await new GetGoogleCalendars(oauth_user_entry_id).run((e, google_calendars) => {
      if(e) this.handleError(e)
      else {
        google_calendars.sort((a:any,b:any) => {
          return (<string> a.summary).localeCompare(b.summary)
        })
        this.res_data = google_calendars
      }
    })
  }

  handleError(error:any) {
    /**
     * 2020-06-29 22:40 
     * 
     * TODO. May need a common way to handle this? The exact error is used in `src/server/method-collection/common/get-entries.ts`
     * as well.
     */
    if(_.get(error, "response.data.error.status") == "PERMISSION_DENIED") {
      this.res_data = { error: <ErrorObject> GOOGLE_AUTHORIZATION_ERROR() }
      return
    }
    else {
      throw error
    }
  }
}