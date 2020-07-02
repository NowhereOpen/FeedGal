import { SessionSocketEventHandler } from "../../socket-handler-base/session"
import { FlattenedLoaderParam, flattenServiceSettings, getEntriesInit } from "~/src/server/method-collection/get-entries-init"
import { commonErrorDetailGenerator } from "../../common"
import { throwControlledError, handleError } from "../../common/convert-error"

// Models
import { oauth_connected_user_storage } from "~/src/server/model-collection/models/oauth-connected-user"

// Types
import {
  GystEntryResponseSuccess,
  GystEntryResponseError
} from "~/src/common/types/pages/main"
import { ErrorName, Error } from "~/src/common/types/common/warning-error"
import { EntriesResult } from "~/src/server/method-collection/common/services/base/types"

export class GystEntriesInitSocketHandler extends SessionSocketEventHandler {
  respond(param:FlattenedLoaderParam, entries_result:EntriesResult) {
    const { service_id, service_setting_id, setting_value_id, setting_value, oauth_connected_user_entry_id } = param

    this.socket.emit("gyst-entries-init-response", <GystEntryResponseSuccess>{
      service_id,
      oauth_connected_user_entry_id,
      setting_value,
      service_setting_id,
      setting_value_id,
      entries: entries_result.entries,
      pagination_data: entries_result.pagination_data,
      service_response: entries_result.service_response,
      warning: entries_result.warning
    })
  }

  respondError(param:FlattenedLoaderParam, error:Error) {
    const { service_id, service_setting_id, setting_value_id, setting_value, oauth_connected_user_entry_id } = param

    this.socket.emit("gyst-entries-init-response", <GystEntryResponseError>{
      service_id,
      oauth_connected_user_entry_id,
      setting_value,
      service_setting_id,
      setting_value_id,
      error,
    })
  }

  async handleImpl() {
    const parameters:FlattenedLoaderParam[] = await flattenServiceSettings(this.user_id!)

    await Promise.all(
      parameters.map(async param => {    
        const error = await throwControlledError(param)
        if(error) {
          return this.respondError(param, error)
        }

        try {
          const entries_result:EntriesResult = await getEntriesInit(param)
          return this.respond(param, entries_result)
        }
        catch(e) {
          const error = await handleError(param, e)
          return this.respondError(param, error)
        }
      })
    )
  }
}