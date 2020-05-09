import { MatchPathFunc } from "~/src/server/gyst-server/server-side-data-injection-collection/base"
import { SessionServerSideDataInjection } from "~/src/server/gyst-server/server-side-data-injection-collection/base/session"

import { OAuthBaseClass } from "gyst-cred-module-suite"
import { cred_module_collection } from "~/src/server/cred-module-collection"

import { oauth_connected_user_storage } from "~/src/server/model-collection/models/oauth-connected-user"

type OAuthInfo = { service_id:string, service_name:string, total_connected:number }

export class SettingsConnectNewAccountPageInjection extends SessionServerSideDataInjection {
  /**
   * Inject
   * 
   *   - gyst_suites
   */
  async loadData() {
    const oauth_infos:OAuthInfo[] = []

    await Promise.all(
      Object.entries(cred_module_collection).map(async ([service_id, _mod]) => {
        const mod = <OAuthBaseClass> _mod
        const service_name = mod.service_name
        const all_connected_accounts = await oauth_connected_user_storage.getAllConnectedAccountsForServiceId(this.user_id!, service_id)
        const total_connected = all_connected_accounts.length
  
        oauth_infos.push({ service_id, service_name, total_connected })
      })
    )

    oauth_infos.sort((a,b) => a.service_name.localeCompare(b.service_name))

    this.data.oauth_infos = oauth_infos
  }
}

export const SettingsConnectNewAccountMatchPath:MatchPathFunc = (matched_path) => {
  return matched_path == "/settings/connect-new-account"
}