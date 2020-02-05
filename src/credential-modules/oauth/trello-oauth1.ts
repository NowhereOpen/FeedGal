/**
 * Refer to:
 *   * https://developers.trello.com/page/authorization
 * for authorization url parameters and OAuth guide.
 * 
 * 
 */
import axios from "axios"

import OAuth1BaseClass from "../lib/oauth1-base"
import { makeApiRequest } from "../lib/api-request"

class Trello extends OAuth1BaseClass {
  constructor(consumer_key:string, consumer_secret:string, redirect_uri:string) {
    super(
      { consumer_key, consumer_secret },
      {
        request: "https://trello.com/1/OAuthGetRequestToken",
        auth: "https://trello.com/1/OAuthAuthorizeToken",
        access_token: "https://trello.com/1/OAuthGetAccessToken",
        // https://developers.trello.com/page/authorization#section-1authorize-route-options
        callback: redirect_uri,
      },
      { "scope": "read,write", "expiration": "30days", "name": "Testing app" }
    )
  }

  async revokeToken(token_response:any) {
    let access_token:string = token_response["oauth_token"]
    
    return await axios.delete(`https://api.trello.com/1/tokens/${access_token}`, {
      params: {
        token: access_token, key: this.cred.consumer_key
      }
    })
  }

  refreshToken() {
    // Cannot refresh. User needs to re-authorize.
    console.log("Trello doesn't require refreshing if access token was retrieved with 'expiration=never'. Please check the code or setting.")
    return Promise.resolve(undefined)
  }

  async getUserInfo(token_data:any) {
    const access_token = token_data["oauth_token"]
    return await axios({
      method: "get", url: "members/me",
      params: {
        key: this.cred.consumer_key,
        token: access_token,
      },
      baseURL: "https://api.trello.com/1"
    })
  }

  async makeApiRequest(token_data:any, method:string, url:string, req_data?:any): Promise<any> {
    const access_token = token_data["oauth_token"]
    
    /**
     * Different apis seems to have different conventions. YouTube uses `headers` and
     * google calednar uses `params`, for example.
     */
    return await makeApiRequest(method, url, {
      baseURL: "https://api.trello.com/1",
      params: {
        key: this.cred.consumer_key,
        token: access_token,
      },
    }, req_data)
  }
}

export default Trello