import { OAuthBaseClass } from "gyst-cred-module-suite"

import { oauth_connected_user_storage } from "~/src/server/model-collection/models/oauth-connected-user"

import { cred_module_collection } from "~/src/server/cred-module-collection"

export async function getOAuthInfos(user_id:string) {
  const oauth_infos:any[] = []

  await Promise.all(
    Object.entries(cred_module_collection).map(async ([service_id, _mod]) => {
      const mod = <OAuthBaseClass> _mod
      const service_name = mod.service_name
      const all_connected_accounts = await oauth_connected_user_storage.getAllConnectedAccountsForServiceId(user_id, service_id)
      const uses_setting_values = false
      const has_setting_values = false

      oauth_infos.push({
        service_id,
        service_name,
        all_connected_accounts,
        btn_class: "btn-" + service_id,
        fa_value: "fa-" + service_id
      })
    })
  )

  oauth_infos.sort((a,b) => a.service_name.localeCompare(b.service_name))

  return oauth_infos
}