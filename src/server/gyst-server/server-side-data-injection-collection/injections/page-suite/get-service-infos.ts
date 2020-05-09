import { getServiceInfo } from "~/src/server/loader-module-collection"

import { cred_module_collection } from "~/src/server/cred-module-collection"

import { ServiceInfo as _ServiceInfo } from "~/src/server/loader-module-collection/loader-module-base/types"

import { ServiceInfo, ServiceInfoOAuthInfo, OAuthConnectedUser } from "~/src/common/types/service-info"

import { oauth_connected_user_storage } from "~/src/server/model-collection/models/oauth-connected-user"

export async function getServiceInfos(user_id:string) {
  const service_ids = ["dark-sky", "github", "google-calendar", "league-of-legends", "reddit", "trello", "twitch", "twitter", "youtube"]
  const services:ServiceInfo[] = []

  /**
   * 2020-03-05 22:30
   * 
   * Iterating through all service_ids and making this data everytime it's requested? Need a better
   * way than that. "Hard code" into the page, or cache it and return the cached data.
   */
  await Promise.all(
    service_ids.map(async service_id => {
      const service_info:_ServiceInfo = getServiceInfo(service_id)

      let oauth_info:ServiceInfoOAuthInfo|undefined = undefined

      if(service_info.is_oauth) {
        const oauth_service_id = <string> service_info.oauth_service_id
        const is_connected:boolean = await oauth_connected_user_storage.isServiceAlreadyConnected(user_id, oauth_service_id)

        let oauth_connected_users:OAuthConnectedUser[] = []
        if(is_connected) {
          const _oauth_connected_users = await oauth_connected_user_storage.getAllConnectedAccountsForServiceId(user_id, oauth_service_id)
          oauth_connected_users = _oauth_connected_users.map(_entry => {
            const entry = _entry.toJSON()
            const displayed_account_name = [entry.service_user_id, entry.friendly_name].filter(entry => entry != null).join("/")
            return <OAuthConnectedUser> {
              _id: entry._id,
              displayed_account_name
            }
          })
        }

        oauth_info = {
          service_id: oauth_service_id,
          service_name: cred_module_collection[oauth_service_id].service_name,
          is_connected,
          oauth_connected_users
        }
      }

      const entry:ServiceInfo = {
        ...service_info,
        oauth: oauth_info
      }

      services.push(entry)
    })
  )

  services.sort((a,b) => a.name.localeCompare(b.name))

  return services
}