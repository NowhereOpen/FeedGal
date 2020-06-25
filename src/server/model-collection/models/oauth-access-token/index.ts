import { MongoStorage } from "~/src/server/model-collection/model-base"

import { IOAuthAccessToken } from "./entities"
import { schema } from "./schema"
import { isValid } from "./lib"

export class OAuthAccessTokenStorage extends MongoStorage implements IOAuthAccessToken {
  constructor(model_name:string) {
    super(model_name, schema)
  }

  async getOAuth1Token(service_id:string, oauth_connected_user_entry_id:string):Promise<any> {
    const result = await this.model.findOne({ service_id, oauth_connected_user_entry_id })
    const oauth1_tokens = result!.get("oauth1_tokens")
    return oauth1_tokens
  }

  async storeOAuth1Token(service_id:string, oauth_connected_user_entry_id:string, token:string, token_secret:string):Promise<any> {
    /**
     * Inserts entry only when used with `await`, `then`, or returning the query??
     * (Return type is 'void' but returning the `updateOne` works)
     * 
     * Doesn't work without using one of them.
     */
    const result = await this.model.updateOne({ service_id, oauth_connected_user_entry_id }, {
      oauth1_tokens: { token, token_secret, retrieved_at: new Date() }
    }, { upsert: true })

    return result
  }

  async getAccessTokenEntry(service_id:string, oauth_connected_user_entry_id:string):Promise<any> {
    const token_entry = await this.model.findOne({ service_id, oauth_connected_user_entry_id })
    if(token_entry == null) {
      console.error(`Access token entry doesn't exist for service_id (${service_id}) oauth_connected_user_entry_id (${oauth_connected_user_entry_id}). Did you retrieve it?`)
      const error = new Error("Access token entry doesn't exist. Did you retrieve it?")
      error.name = "NO_ENTRY"
      Object.assign(error, { oauth_connected_user_entry_id, service_id })
      throw error
    }

    /**
     * Without this, it will return an entry where `oauth1_tokens = {}` instead of undefined.
     */
    const token_entry_json = token_entry.toJSON()

    return token_entry_json
  }

  async getTokenData(service_id:string, oauth_connected_user_entry_id:string):Promise<any> {
    const entry = await this.getAccessTokenEntry(service_id, oauth_connected_user_entry_id)
    return entry.data
  }

  async storeTokenData(service_id:string, oauth_connected_user_entry_id:string, token_data:any):Promise<any> {
    const access_token = await this.model.updateOne({ service_id, oauth_connected_user_entry_id }, {
      service_id,
      data: token_data,
      retrieved_at: new Date()
    }, { upsert: true })
  }

  async refreshAccessToken(service_id:string, oauth_connected_user_entry_id:string, token_data:any):Promise<any> {
    const old_token_data = await this.getTokenData(service_id, oauth_connected_user_entry_id)

    /**
     * Don't "replace" the whole data. Refer to the `ITokenStorage` comment.
     */
    token_data = Object.assign(old_token_data, token_data)
    const result = await this.model.updateOne({ service_id, oauth_connected_user_entry_id }, {
      data: token_data,
      refreshed_at: new Date()
    })

    return result
  }

  async invalidateAccessToken(service_id:string, oauth_connected_user_entry_id:string):Promise<any> {
    const result = await this.model.updateOne({ service_id, oauth_connected_user_entry_id }, {
      invalid_at: new Date()
    })

    return result
  }

  async getTimeInfo(service_id:string, oauth_connected_user_entry_id:string):Promise<any> {
    const token_data = await this.getAccessTokenEntry(service_id, oauth_connected_user_entry_id)

    return {
      retrieved_at: token_data.retrieved_at,
      invalid_at: token_data.invalid_at,
      refreshed_at: token_data.refreshed_at
    }
  }

  async tokenExists(service_id:string, oauth_connected_user_entry_id:string) {
    const entry = await this.model.findOne({ service_id, oauth_connected_user_entry_id })
    // Token exists if `data` property is not null
    const exists = entry != null && entry.get("data") != null
    return exists
  }

  async getValidTokenEntries(gyst_user_uid:string):Promise<any[]> {
    const token_entries = await this.model.find({ oauth_connected_user_entry_id: gyst_user_uid })
    const valid_token_entries = token_entries.filter(entry => isValid(entry))

    return valid_token_entries
  }

  async getTotalUserTokens(oauth_connected_user_entry_id:string) {
    const entries = await this.model.find({ oauth_connected_user_entry_id })
    return entries.length
  }

  async deleteEntry(service_id:string, oauth_connected_user_entry_id:string) {
    const result = await this.model.deleteOne({ service_id, oauth_connected_user_entry_id })
    return {
      delete_count: result.deletedCount ? result.deletedCount : 0
    }
  }
}

export let oauth_access_token_storage:OAuthAccessTokenStorage

export function setup(model_name:string) {
  oauth_access_token_storage = new OAuthAccessTokenStorage(model_name)
  oauth_access_token_storage.setup()
}

export async function getAccessTokenCommon(service_id:string, oauth_connected_user_entry_id:string) {
  const token_data = await oauth_access_token_storage.getTokenData(service_id, oauth_connected_user_entry_id)
  const access_token = token_data["access_token"]
  return access_token
}