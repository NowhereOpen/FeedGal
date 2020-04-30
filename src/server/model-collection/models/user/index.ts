import { MongoStorage, DeleteUser, DeleteResult } from "~/src/server/model-collection/model-base"

import { IGystUser, UserInfo } from "./entities"
import { schema } from "./schema"

export class GystUserStorage extends MongoStorage implements IGystUser {
  constructor(model_name:string) {
    super(model_name, schema)
  }

  async createNewGystUser(user_info:UserInfo):Promise<string> {
    const result = await this.model.create({
      friendly_name: user_info.friendly_name,
      created_at: new Date()
    })

    const entry_id = String(result._id)

    return entry_id
  }

  async updateUserInfo(entry_id:string, user_info:UserInfo):Promise<any> {
    const entries:any = {}

    const info_fields = ["friendly_name"]

    info_fields.forEach((_field_name) => {
      const field_name = <keyof UserInfo> _field_name
      entries[field_name] = user_info[field_name]
    })

    entries.updated_at = new Date()

    return await this.model.updateOne({ _id: entry_id }, { $set: entries })
  }

  async userExists(entry_id:string):Promise<boolean> {
    try {
      return await this.model.exists({ _id: entry_id })
    }
    catch(e) {
      if(e.name == "CastError") {
        /**
         * 2019-12-04 21:07 While testing, I just pass non-object-id generated
         * string like "test value" instead of "5dff4e...." thing, expecting the
         * `exists` method to return false, instead it returns an error.
         * 
         * So, just return false in such case.
         */
        return false
      }
      
      throw e
    }
  }

  async getUserInfo(entry_id:string):Promise<any> {
    return await this.model.findById(entry_id)
  }

  async deleteUser(entry_id:string) {
    try {
      const result = await this.model.deleteOne({ _id: entry_id })
      return {
        delete_count: result.deletedCount ? result.deletedCount : 0
      }
    }
    catch(e) {
      /**
       * Invalid id error from automated tests. This is the error want the result
       * to be controlled.
       */
      if(e.name == "CastError") {
        return { delete_count: 0 }
      }

      throw e
    }
  }
}

export let gyst_user_storage:GystUserStorage

export function setup(model_name:string) {
  gyst_user_storage = new GystUserStorage(model_name)
  gyst_user_storage.setup()
}