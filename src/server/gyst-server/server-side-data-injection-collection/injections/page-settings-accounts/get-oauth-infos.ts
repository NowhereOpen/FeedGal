import { OAuthBaseClass } from "gyst-cred-module-suite"

import { oauth_connected_user_storage } from "~/src/server/model-collection/models/oauth-connected-user"

import { cred_module_collection } from "~/src/server/cred-module-collection"

export type OAuthInfo = { service_id:string, service_name:string, total_connected:number }

export async function getOAuthInfos(user_id:string) {
  const oauth_infos:OAuthInfo[] = []

  await Promise.all(
    Object.entries(cred_module_collection).map(async ([service_id, _mod]) => {
      const mod = <OAuthBaseClass> _mod
      const service_name = mod.service_name
      const all_connected_accounts = await oauth_connected_user_storage.getAllConnectedAccountsForServiceId(user_id, service_id)
      const total_connected = all_connected_accounts.length

      oauth_infos.push({ service_id, service_name, total_connected })
    })
  )

  oauth_infos.sort((a,b) => a.service_name.localeCompare(b.service_name))

  return oauth_infos
}