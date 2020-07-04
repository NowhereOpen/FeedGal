import { OAuthMethodBase } from "../base/oauth-method-base"

import { getCalendars } from "~/src/server/lib/loader-module-helpers/services/google-calendar"

export class GetGoogleCalendars extends OAuthMethodBase {
  constructor(oauth_user_entry_id:string) {
    super({ oauth_service_id: "google", oauth_user_entry_id })
  }

  async runImpl(token_data:any) {
    const res_data = await getCalendars(token_data["access_token"])
    return res_data.items
  }
}