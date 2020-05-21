import { 
  GystEntryResponse,
  GystEntryResponseSuccess,
  GystEntryResponseError,
  GystEntryResponseErrorDetails,
  GystEntryResponseGeneralError,
} from "~/src/common/types/gyst-entry"

import { oauth_connected_user_storage } from "~/src/server/model-collection/models/oauth-connected-user"
import { oauth_access_token_storage } from "~/src/server/model-collection/models/oauth-access-token"
import { service_setting_storage } from "~/src/server/model-collection/models/service-setting"
import { setting_value_storage } from "~/src/server/model-collection/models/setting-value"

import { getServiceInfo, getEntriesInitNonOAuth, getEntriesInitOAuth } from "~/src/server/loader-module-collection"
import { LoaderModuleOutput } from "~/src/server/loader-module-collection/loader-module-base/types"

import { refreshTokenIfFail } from "../common"

type FlattenedLoaderParam = {
  service_id:string,
  service_setting_id:string,
  setting_value_id?:string,
  setting_value?:any,
  oauth_connected_user_entry_id?:string
}

export async function getEntriesInit(
  user_id:string,
  cb:(data:GystEntryResponse) => Promise<void>
) {
  const parameters:FlattenedLoaderParam[] = await flattenServiceSettings(user_id)

  if(parameters.length == 0) {
    const response:GystEntryResponseGeneralError = {
      error: {
        name: "NO_SERVICE_SETTINGS",
        message: "The selected Gyst suite has no service settings. Couldn't load any entries.",
        data: {}
      }
    }

    return cb(response)
  }
  else {
    await Promise.all(
      parameters.map(async entry => {
        let entry_response:GystEntryResponse
        try {
          entry_response = await getEntriesInitWithParam(entry)
        }
        catch(e) {
          const is_known_error = ["OAUTH_CONNECTED_USER_NOT_EXIST", "INVALID_SETTING_VALUE", "ERROR_ON_REFRESH_TOKEN"].includes(e.name)
          let error_detail:GystEntryResponseErrorDetails
          if(is_known_error) {
            /**
             * 2020-03-21 22:39
             * `response.error = e` doesn't set `response.error.message`
             * when `e` is an error created with `new Error("Some message")`
             * for some reason. So have to assign each property individually.
             */
            error_detail = {
              name: e.name,
              message: e.message,
              data: e.data
            }
          }
          else {
            error_detail = {
              name: "DEV_FAULT",
              message: "The developer did something wrong.",
              data: {
                error: {
                  name: e.name,
                  message: e.message
                }
              }
            }
          }

          entry_response = <GystEntryResponseError> {
            service_id: entry.service_id,
            oauth_connected_user_entry_id: entry.oauth_connected_user_entry_id,
            setting_value: entry.setting_value,
            service_setting_id: entry.service_setting_id,
            setting_value_id: entry.setting_value_id,
            error: error_detail
          }
        }
        return cb(entry_response)
      })
    )
  }
}

async function getEntriesInitWithParam(param:FlattenedLoaderParam):Promise<GystEntryResponseSuccess> {
  const service_id = param.service_id
  const is_oauth = getServiceInfo(service_id).is_oauth
  const setting_value = param.setting_value

  let result!:LoaderModuleOutput
  if(is_oauth) {
    const oauth_connected_user_entry_id = param.oauth_connected_user_entry_id!
    await refreshTokenIfFail(service_id, oauth_connected_user_entry_id, async (token_data) => {
      result = await getEntriesInitOAuth(service_id, token_data, setting_value)
    })
  }
  else {
    result = await getEntriesInitNonOAuth(service_id, setting_value)
  }

  const response:GystEntryResponseSuccess = {
    service_id,
    service_setting_id: param.service_setting_id,
    setting_value_id: param.setting_value_id,
    oauth_connected_user_entry_id: param.oauth_connected_user_entry_id,
    setting_value: param.setting_value,
    entries: result.entries,
    pagination_data: {
      index: 0,
      options: result.pagination_options,
    },
    service_response: result.service_response
  }

  return response
}

async function flattenServiceSettings(user_id:string):Promise<FlattenedLoaderParam[]> {
  const _service_settings = await service_setting_storage.getEnabledServiceSettingsForUserId(user_id)
  const service_settings = _service_settings.map(entry => entry.toJSON())

  let flattened:FlattenedLoaderParam[] = []
  
  await Promise.all(
    service_settings.map(async service_setting => {
      const service_id = service_setting.service_id
      const service_setting_entry_id = service_setting._id
      
      const service_info = getServiceInfo(service_id)

      const uses_setting_value = service_info.uses_setting_value
      const is_oauth = service_info.is_oauth

      const flattened_entries:FlattenedLoaderParam[] = []

      if(uses_setting_value) {
        const _setting_value_entries = await setting_value_storage.getValidSettingValues(service_setting_entry_id)
        const setting_value_entries = _setting_value_entries.map(setting_value => setting_value.toJSON())

        setting_value_entries.forEach(setting_value_entry => {
          flattened_entries.push({
            service_id,
            service_setting_id: service_setting_entry_id,
            setting_value_id: setting_value_entry._id,
            setting_value: setting_value_entry.value
          })
        })
      }
      else {
        flattened_entries.push({
          service_id,
          service_setting_id: service_setting_entry_id
        })
      }

      if(is_oauth) {
        const oauth_connected_user_entry_id = await service_setting_storage.getOAuthConnectedUserEntryId(service_setting_entry_id)
        flattened_entries.forEach(entry => {
          entry.oauth_connected_user_entry_id = oauth_connected_user_entry_id
        })
      }

      flattened = flattened.concat(flattened_entries)
    })
  )

  return flattened
}