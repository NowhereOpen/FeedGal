import { MatchPathFunc } from "~/src/server/gyst-server/server-side-data-injection-collection/base"
import { SessionServerSideDataInjection } from "~/src/server/gyst-server/server-side-data-injection-collection/base/session"

import { OAuthBaseClass } from "gyst-cred-module-suite"
import { cred_module_collection } from "~/src/server/cred-module-collection"

import * as gystSession from "~/src/server/gyst-server/common/session"

import { gyst_user_storage } from "~/src/server/model-collection/models/user"
import { oauth_connected_user_storage } from "~/src/server/model-collection/models/oauth-connected-user"

import { PageLoginOAuthInfo } from "~/src/common/types/oauth-info-variations"

export class LoginPageInjection extends SessionServerSideDataInjection {
  getOptions() {
    const options = super.getOptions()
    options.anon_user_early_quit = false
    return options
  }

  async loadData() {
    this.data.is_logged_in = gystSession.isLoggedin(<any> this.req)

    if(this.data.is_logged_in) {
      const user_id = gystSession.getLoggedInUserId(<any> this.req)
      this.data.user_info = await gyst_user_storage.getUserInfo(user_id)
    }
    else {
      const unsorted_oauth_infos:{ [service_id:string]: PageLoginOAuthInfo } = {}
      await Promise.all(
        Object.entries(cred_module_collection).map(async ([service_id, _mod]) => {
          const mod = <OAuthBaseClass> _mod
          const service_name = mod.service_name
  
          /**
           * 2020-03-13 11:16
           * Could use "beutify number" (I named that up). 1,560,000 can be just 1.5M.
           */
          const total_signup = await oauth_connected_user_storage.countSignupAccounts(service_id)
          const total_service_connected = await oauth_connected_user_storage.countConnected(service_id)
          const total_accounts_connected = await oauth_connected_user_storage.countConnectedAccounts(service_id)
  
          /**
           * 2020-03-02 11:53
           * 
           * Could include authentication url where the user authenticates using the third party
           * service here. But this can be done on the frontend using `document.location.origin`.
           * When this is done on the backend, the backend needs to know where the server is
           * hosted and stuff which is doable but taking this approach for now.
           */
          unsorted_oauth_infos[service_id] = {
            service_id,
            service_name,
            /// @ts-ignore
            total_signup,
            total_service_connected,
            total_accounts_connected,
          }
        })
      )

      const sorted_keys = Object.keys(unsorted_oauth_infos).sort()
      const oauth_infos:{ [service_id:string]: PageLoginOAuthInfo } = {}
      sorted_keys.forEach(key => {
        oauth_infos[key] = unsorted_oauth_infos[key]
      })
      this.data.oauth_infos = oauth_infos
    }
  }
}

export const LoginPageMatchPath:MatchPathFunc = (matched_path) => {
  return matched_path == "/login"
}