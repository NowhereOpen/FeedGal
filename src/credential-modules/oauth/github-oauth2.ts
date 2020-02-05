import axios from "axios"
import * as querystring from "querystring"

import OAuth2BaseClass from "../lib/oauth2-base"
import { makeApiRequest } from "../lib/api-request"

export default class Github extends OAuth2BaseClass {
  constructor(client_id:string, client_secret:string, redirect_uri:string) {
    super(
      { client_id, client_secret },
      {
        auth: "https://github.com/login/oauth/authorize",
        token: "https://github.com/login/oauth/access_token",
      },
      {
        shared: {
          "client_id": client_id,
          "redirect_uri": redirect_uri,
          "state":"",
        },
        /**
         * https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#1-request-a-users-github-identity
         */
        auth: { scope: "repo" },
        token: {
          "client_secret": client_secret,
          "code": ""
        },
      },
      {
        method: "POST",
        data_type: "QUERY_PARAM",
        is_oauth_header: false
      }
    )
  }

  async getTokenResponse(url:string) {
    const response_data = await super.getTokenResponse(url)
    return response_data
  }

  /**
   * Github sends a string type that can be parsed with `querystring` module
   * when requesting a token, but returns JSON when refreshing the token.
   * 
   * @param url 
   */
  private parseTokenResponse(token_response:any) {
    if(typeof token_response == "string") {
      const parsed_token_response = querystring.parse(token_response);
      return parsed_token_response
    }
    else {
      return token_response
    }
  }

  private getAccessTokenFromTokenResponse(token_response:any) {
    if(typeof token_response == "string") {
      const parsed_token_response = this.parseTokenResponse(token_response)
      return parsed_token_response["access_token"]
    }
    else {
      return token_response.token
    }
  }

  async revokeToken(token_response:any) {
    const access_token = this.getAccessTokenFromTokenResponse(token_response)
    await axios.delete(`https://api.github.com/applications/${this.cred.client_id}/tokens/${access_token}`, {
      auth: {
        username: this.cred.client_id,
        password: this.cred.client_secret
      }
    })
    return 
  }

  /**
   * It's said that the github access_token don't expire but the following request works, response including the same token.
   */
  async refreshToken(token_response:any) {
    const access_token = this.getAccessTokenFromTokenResponse(token_response)
    return await axios.get(`https://api.github.com/applications/${this.cred.client_id}/tokens/${access_token}`, {
      auth: {
        username: this.cred.client_id,
        password: this.cred.client_secret
      }
    })
  }

  async getUserInfo(token_response:any) {
    const access_token = this.getAccessTokenFromTokenResponse(token_response)
    const axios_config:any = {
      headers: {
        Authorization: `token ${access_token}`
      },
      baseURL: "https://api.github.com",
      url: "user", method: "get"
    }

    return await axios(axios_config)
  }

  async makeApiRequest(token_data:any, method:string, url:string, req_data?:any): Promise<any> {
    const access_token = this.getAccessTokenFromTokenResponse(token_data)
    
    return await makeApiRequest(method, url, {
      baseURL: "https://api.github.com",
      headers: {
        Authorization: `token ${access_token}`
      }
    }, req_data)
  }
}