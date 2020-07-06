import { OAuthBaseClass } from "oauth-module-suite"

import { cred_module_collection } from "~/src/server/cred-module-collection"
import { getRevokeInfo } from "./get-revoke-url"

// Typing
import { RevokeInfo, OAuthInfos, OAuthInfo } from "~/src/common/types/pages/settings-accounts"

export async function getOAuthInfos():Promise<OAuthInfos> {
  const oauth_infos:OAuthInfo[] = []

  await Promise.all(
    Object.entries(cred_module_collection).map(async ([service_id, _mod]) => {
      const mod = <OAuthBaseClass> _mod
      const service_name = mod.service_name
      const revoke_info:RevokeInfo|undefined = getRevokeInfo(service_id)

      oauth_infos.push({
        service_id,
        service_name,
        revoke_info,
        btn_class: "btn-" + service_id,
        fa_value: "fa-" + service_id
      })
    })
  )

  oauth_infos.sort((a,b) => a.service_name.localeCompare(b.service_name))

  return oauth_infos
}