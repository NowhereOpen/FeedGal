import { SessionRequestHandlerBase } from "~/src/server/gyst-server/express-server-endpoint-collection/endpoint-base/session"

import { service_setting_storage } from "~/src/server/model-collection/models/service-setting"
import { getCalendars } from "~/src/server/lib/loader-module-helpers/services/google-calendar"
import { refreshTokenIfFail } from "~/src/server/method-collection/common"

export class GetGoogleCalendarsRequestHandler extends SessionRequestHandlerBase {
  service_setting_id!:string

  storeParams():void|Promise<void> {
    this.service_setting_id = this.req.params.service_setting_id
  }

  async doTasks():Promise<void> {
    const oauth_connected_user_entry_id:string = await service_setting_storage.getOAuthConnectedUserEntryId(this.service_setting_id)
    let google_calendars
    await refreshTokenIfFail("google-calendar", oauth_connected_user_entry_id, async (token_data) => {
      const res_data = await getCalendars(token_data["access_token"])
      google_calendars = res_data.items
    })

    this.res_data = google_calendars
  }
}