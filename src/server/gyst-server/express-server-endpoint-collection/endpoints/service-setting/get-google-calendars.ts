import _ from "lodash"

import { SessionRequestHandlerBase } from "~/src/server/gyst-server/express-server-endpoint-collection/endpoint-base/session"
import { service_setting_storage } from "~/src/server/model-collection/models/service-setting"
import { getCalendars } from "~/src/server/lib/loader-module-helpers/services/google-calendar"
import { refreshTokenIfFail } from "~/src/server/method-collection/common/refresh-token-if-fail"

import { GOOGLE_AUTHORIZATION_ERROR } from "~/src/common/warning-error"

// Types
import { ErrorObject } from "~/src/common/types/common/warning-error"

export class GetGoogleCalendarsRequestHandler extends SessionRequestHandlerBase {
  service_setting_id!:string

  storeParams():void|Promise<void> {
    this.service_setting_id = this.req.params.service_setting_id
  }

  async doTasks():Promise<void> {
    const oauth_connected_user_entry_id:string = await service_setting_storage.getOAuthConnectedUserEntryId(this.service_setting_id)
    let google_calendars

    try {
      await refreshTokenIfFail("google-calendar", oauth_connected_user_entry_id, async (token_data) => {
        const res_data = await getCalendars(token_data["access_token"])
        google_calendars = res_data.items
      })
    }
    catch(e) {
      /**
       * 2020-06-29 22:40 
       * 
       * TODO. May need a common way to handle this? The exact error is used in `src/server/method-collection/common/get-entries.ts`
       * as well.
       */
      if(_.get(e, "response.data.error.status") == "PERMISSION_DENIED") {
        this.res_data = { error: <ErrorObject> GOOGLE_AUTHORIZATION_ERROR }
        return
      }
      else {
        throw e
      }
    }

    this.res_data = google_calendars
  }
}