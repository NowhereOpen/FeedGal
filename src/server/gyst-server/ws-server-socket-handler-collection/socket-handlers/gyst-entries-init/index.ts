import {
  GystEntryResponse,
  GystEntryResponseSuccess,
  GystEntryResponseError,
  GystEntryResponseErrorDetails,
  GystEntryResponseGeneralError,
  GystEntryError,
  GystEntryWarning
} from "~/src/common/types/pages/main"
import { SessionSocketEventHandler } from "~/src/server/gyst-server/ws-server-socket-handler-collection/socket-handler-base/session"
import { FlattenedLoaderParam, flattenServiceSettings, getEntriesInitWithParam } from "~/src/server/method-collection/get-entries-init"
import { LoaderModuleOutput } from "~/src/server/loader-module-collection/loader-module-base/types"

import { oauth_connected_user_storage } from "~/src/server/model-collection/models/oauth-connected-user"

import { commonErrorDetailGenerator } from "../../common"

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

        if(oauth_connected_user_entry_id) {
          const is_error = await oauth_connected_user_storage.isErrorWithOAuthUserEntryId(oauth_connected_user_entry_id)
          if(is_error) {
            const entry_response = <GystEntryResponseError> {
              service_id,
              oauth_connected_user_entry_id,
              setting_value,
              service_setting_id,
              setting_value_id,
              error: {
                name: "TOKEN_ERROR",
                data: {},
                message: "Please reconnect your service account.",
              }
            }
          }
        }
    
        try {
          const response:GystEntryResponseSuccess = await getEntriesInitWithParam(param)
          return this.respond(response)
        }
        catch(e) {
          const known_errors:GystEntryError[] = ["TOKEN_ERROR", "INVALID_SETTING_VALUE"]
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