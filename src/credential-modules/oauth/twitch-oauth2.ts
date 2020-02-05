import axios from "axios"
import * as querystring from "querystring"

import OAuth2BaseClass from "../lib/oauth2-base"
import { makeApiRequest } from "../lib/api-request"

export default class Twitch extends OAuth2BaseClass {
  constructor(client_id:string, client_secret:string, redirect_uri:string) {
    super(
      { client_id, client_secret },
      {
        auth: "https://id.twitch.tv/oauth2/authorize",
        token: "https://id.twitch.tv/oauth2/token",
      },
      {
        shared: {
          "client_id": client_id,
          "redirect_uri": redirect_uri
        },
        // https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/
        auth: {
          "response_type": "code",
          "scope": "user:edit channel:read:subscriptions moderation:read user:read:email",
          force_verify: true,
        },
        token: {
            "client_secret": client_secret,
            "grant_type": "authorization_code",
        },
      },
      {
        method: "POST",
        data_type: "QUERY_PARAM",
        is_oauth_header: false
      }
    )
  }

  async revokeToken(token_response:any) {
    const { data } = await axios.post("https://id.twitch.tv/oauth2/revoke", null, {
      params: {
        client_id: this.cred.client_id,
        token: token_response["access_token"]
      }
    })

    return
  }
  
  async refreshToken(token_response:any) {
    const data = querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: token_response["refresh_token"],
      client_id: this.cred.client_id,
      client_secret: this.cred.client_secret
    })

    return await axios.post("https://id.twitch.tv/oauth2/token", data)
  }

  async getUserInfo(token_data:any) {
    const access_token = token_data["access_token"]
    return await axios({
      method: "get", url: "users", baseURL: "https://api.twitch.tv/helix",
      headers: { Authorization: `Bearer ${access_token}` },
    })
  }

  async makeApiRequest(token_data:any, method:string, url:string, req_data?:any): Promise<any> {
    const access_token = token_data["access_token"]
    
    /**
     * Different apis seems to have different conventions. YouTube uses `headers` and
     * google calednar uses `params`, for example.
     */
    return await makeApiRequest(method, url, {
      baseURL: "https://api.twitch.tv/helix",
      headers: { Authorization: `Bearer ${access_token}` },
    }, req_data)
  }
}