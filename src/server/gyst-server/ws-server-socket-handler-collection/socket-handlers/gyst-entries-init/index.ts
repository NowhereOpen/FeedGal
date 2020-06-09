import {
  GystEntryResponse,
  GystEntryResponseSuccess,
  GystEntryResponseError,
  GystEntryResponseErrorDetails,
  GystEntryResponseGeneralError,
  GystEntryError,
  GystEntryWarning
} from "~/src/common/types/gyst-entry"
import { SessionSocketEventHandler } from "~/src/server/gyst-server/ws-server-socket-handler-collection/socket-handler-base/session"
import { FlattenedLoaderParam, flattenServiceSettings, getEntriesInitWithParam } from "~/src/server/method-collection/get-entries-init"
import { LoaderModuleOutput } from "~/src/server/loader-module-collection/loader-module-base/types"
import { commonErrorDetailGenerator } from "~/src/server/method-collection/common"

export class GystEntriesInitSocketHandler extends SessionSocketEventHandler {
  respond(data:any) {
    this.socket.emit("gyst-entries-init-response", data)
  }

  async handleImpl() {
    const parameters:FlattenedLoaderParam[] = await flattenServiceSettings(this.user_id!)

    if(parameters.length == 0) {
      const response:GystEntryResponseGeneralError = {
        error: {
          name: "NO_SERVICE_SETTINGS",
          message: "The selected Gyst suite has no service settings. Couldn't load any entries.",
          data: {}
        }
      }
      return this.respond(response)
    }

    await Promise.all(
      parameters.map(async param => {
        const { service_id, service_setting_id, setting_value_id, setting_value, oauth_connected_user_entry_id } = param
    
        try {
          const response:GystEntryResponseSuccess = await getEntriesInitWithParam(param)        
          return this.respond(response)
        }
        catch(e) {
          const known_errors:GystEntryError[] = ["OAUTH_CONNECTED_USER_NOT_EXIST", "INVALID_SETTING_VALUE", "ERROR_ON_REFRESH_TOKEN"]
          const error_detail = commonErrorDetailGenerator(e, known_errors)

          const entry_response = <GystEntryResponseError> {
            service_id,
            oauth_connected_user_entry_id,
            setting_value,
            service_setting_id,
            setting_value_id,
            error: error_detail
          }

          return this.respond(entry_response)
        }
      })
    )
  }
}