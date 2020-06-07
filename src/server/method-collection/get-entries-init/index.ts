import { 
  GystEntryResponse,
  GystEntryResponseSuccess,
  GystEntryResponseError,
  GystEntryResponseErrorDetails,
  GystEntryResponseGeneralError,
  GystEntryError
} from "~/src/common/types/gyst-entry"

import { getServiceInfo, getEntriesInitNonOAuth, getEntriesInitOAuth } from "~/src/server/loader-module-collection"
import { LoaderModuleOutput } from "~/src/server/loader-module-collection/loader-module-base/types"

import { refreshTokenIfFail } from "../common"

export * from "./flatten-service-settings"
export * from "./get-entries"
export * from "./type"

// export async function getEntriesInit(
//   user_id:string,
//   cb:(data:GystEntryResponse|GystEntryResponseGeneralError) => Promise<void>
// ) {
//   const parameters:FlattenedLoaderParam[] = await flattenServiceSettings(user_id)

//   if(parameters.length == 0) {
//     const response:GystEntryResponseGeneralError = {
//       error: {
//         name: "NO_SERVICE_SETTINGS",
//         message: "The selected Gyst suite has no service settings. Couldn't load any entries.",
//         data: {}
//       }
//     }

//     return cb(response)
//   }
//   else {
//     await Promise.all(
//       parameters.map(async entry => {
//         let entry_response:GystEntryResponse
//         try {
//           entry_response = await getEntriesInitWithParam(entry)
//         }
//         catch(e) {
//           const is_known_error = (<GystEntryError[]> [
//             "OAUTH_CONNECTED_USER_NOT_EXIST", "INVALID_SETTING_VALUE", "ERROR_ON_REFRESH_TOKEN", "DEV_FAULT_MSG"
//           ]).includes(e.name)
//           let error_detail:GystEntryResponseErrorDetails
//           if(is_known_error) {
//             /**
//              * 2020-03-21 22:39
//              * `response.error = e` doesn't set `response.error.message`
//              * when `e` is an error created with `new Error("Some message")`
//              * for some reason. So have to assign each property individually.
//              */
//             error_detail = {
//               name: e.name,
//               message: e.message,
//               data: e.data
//             }
//           }
//           else {
//             error_detail = {
//               name: "DEV_FAULT",
//               message: "The developer did something wrong.",
//               data: {
//                 error: {
//                   name: e.name,
//                   message: e.message
//                 }
//               }
//             }
//           }

//           entry_response = <GystEntryResponseError> {
//             service_id: entry.service_id,
//             oauth_connected_user_entry_id: entry.oauth_connected_user_entry_id,
//             setting_value: entry.setting_value,
//             service_setting_id: entry.service_setting_id,
//             setting_value_id: entry.setting_value_id,
//             error: error_detail
//           }
//         }
//         return cb(entry_response)
//       })
//     )
//   }
// }