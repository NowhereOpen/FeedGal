import { MongoStorage, DeleteUser, DeleteResult, UserId } from "~/src/server/model-collection/model-base"

import { IOAuthConnectedUser, UserInfo } from "./entities"
import { schema } from "./schema"

export class OAuthConnectedUserStorage extends MongoStorage implements IOAuthConnectedUser {
  constructor(model_name:string) {
    super(model_name, schema)
  }

  modifySchema() {
    this.schema.index({ user_id: 1, service_id: 1, service_user_uid: 1 }, { unique: true })
  }

  async connect(user_id:UserId, service_id:string, user_info:UserInfo, user_info_result:any) {
    return await this._connect(user_id,service_id, user_info, user_info_result, false)
  }

  async connectAsSignup(user_id:UserId, service_id:string, user_info:UserInfo, user_info_result:any) {
    return await this._connect(user_id,service_id, user_info, user_info_result, true)
  }

  async _connect(user_id:UserId, service_id:string, user_info:UserInfo, user_info_result:any, is_signup:boolean) {
    try {
      const result = await this.model.create({
        user_id,
        service_id,
        is_signup,
        service_user_uid: user_info.user_uid,
        service_user_id: user_info.user_id,
        friendly_name: user_info.friendly_name,
        user_info_cache: user_info_result,
      })

      return String(result._id)
    }
    catch(e) {
      if(e.code == 11000) {
        const error = new Error("The `user_id` and `service_id` pair already exists.")
        error.name = "DUPLICATE_ENTRY"
        Object.assign(error, { user_id, service_id })
        throw error
      }
      throw e
    }
  }

  async getEntry(entry_id:string) {
    return this.model.findOne({ _id: entry_id })
  }

  async isSignup(entry_id:string) {
    const result = await this.model.findOne({ _id: entry_id })
    if(result == null) return false
    const is_signup = result!.get("is_signup")
    return is_signup
  }

  async isAlreadyConnected(user_id:UserId, service_id:string) {
    return await this.model.exists({ user_id, service_id })
  }

  async isServiceAlreadyConnected(user_id:UserId, service_id:string) {
    return this.model.exists({ user_id, service_id })
  }

  async isServiceAccountAlreadyConnected(user_id:UserId, service_id:string, user_uid:string) {
    return this.model.exists({ user_id, service_id, service_user_uid: user_uid })
  }

  async isErrorWithUserUid(service_id:string, user_uid:string) {
    const entry = await this.model.findOne({ service_id, service_user_uid: user_uid })

    if(entry == null) {
      // Connecting a new account
      return false
    }
    else {
      return entry!.get("error_with_access_token")
    }
  }

  async isErrorWithOAuthUserEntryId(id:string) {
    const entry = await this.model.findOne({ _id: id })
    return entry!.get("error_with_access_token")
  }

  async countSignupAccounts(service_id:string) {
    const results = await this.model.find({ service_id, is_signup: true })
    return results.length
  }

  async countConnectedAccounts(service_id:string) {
    const results = await this.model.find({ service_id })
    return results.length
  }

  async countConnected(service_id:string) {
    const results = await this.model.aggregate([
      { $match: { service_id } },
      {
        $group: {
          _id: { user_id: "$user_id", service_id: "$service_id" },
          count: { $sum: 1 }
        }
      }
    ])

    return results.length
  }
  
  async disconnect(entry_id:string):Promise<any> {
    const exists = await this.model.exists({ _id: entry_id })
    if(! exists) {
      const error = new Error("An entry with user_id and service_id pair doesn't exist.")
      error.name = "NO_ENTRY"
      Object.assign(error, { entry_id })
      throw error
    }

    const is_signup = await this.isSignup(entry_id)

    if(is_signup) {
      const error = new Error("A signup account cannot be disconnected.")
      error.name = "ACTION_NOT_ALLOWED"
      Object.assign(error, { entry_id })
      throw error
    }

    const result = await this.model.deleteOne({ _id: entry_id })

    return result
  }

  async setError(entry_id:string, value:boolean) {
    return this.model.updateOne({ _id:entry_id }, { $set: { error_with_access_token: value } })
  }

  async getAllEntriesForUserId(user_id:string) {
    return this.model.find({ user_id })
  }

  async getAllConnectedServiceIds(user_id:UserId):Promise<string[]> {
    const entries = await this.model.find({ user_id })
    const service_ids = entries.map(entry => entry.get("service_id"))
    return service_ids
  }

  async getAllConnectedAccountsForServiceId(user_id:UserId, service_id:string):Promise<any[]> {
    return this.model.find({ user_id, service_id })
  }

  async getAllAliveAccounts(user_id:UserId) {
    return this.model.find({ user_id, error_with_access_token: false })
  }

  async userConnected(service_id:string, user_uid:string):Promise<boolean> {
    return await this.model.exists({ service_id, service_user_uid: user_uid })
  }

  async serviceConnected(service_id:string, user_id:UserId):Promise<boolean> {
    return await this.model.exists({ service_id, user_id})
  }

  async getSignupEntry(service_id:string, user_uid:string) {
    const result = await this.model.findOne({ service_id, service_user_uid: user_uid, is_signup: true })
    return result
  }

  async getEntryWithUserUid(service_id:string, user_uid:string) {
    return this.model.findOne({ service_id, service_user_uid: user_uid })
  }

  async getEntryIds(service_id:string, user_uid:string) {
    const result = await this.model.find({ service_id, service_user_uid: user_uid })
    return result.map(entry => String(entry!._id))
  }

  async getUserInfoCache(entry_id:string) {
    const result = await this.model.findOne({ _id: entry_id })
    return result!.get("user_info_cache")
  }

  async deleteUser(user_id:string) {
    const result = await this.model.deleteMany({ user_id })
    return {
      delete_count: result.deletedCount ? result.deletedCount : 0
    }
  }
}

export let oauth_connected_user_storage:OAuthConnectedUserStorage

export function setup(model_name:string) {
  oauth_connected_user_storage = new OAuthConnectedUserStorage(model_name)
  oauth_connected_user_storage.setup()
}