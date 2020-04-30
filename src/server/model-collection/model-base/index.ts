import * as mongoose from "mongoose"

export class MongoStorage {
  model_name:string
  schema_def:any
  schema!:mongoose.Schema
  model!:mongoose.Model<mongoose.Document>
  
  constructor(model_name:string, schema_def:any) {
    this.model_name = model_name
    this.schema_def = schema_def
    this.setupSchema()
  }

  /**
   * 2020-04-06 10:17
   * 
   * Useful when overriding the default behavior. Eg, modifying the collection name
   * to disable pluralization
   */
  setupSchema() {
    this.schema = new mongoose.Schema(this.schema_def)
  }

  /**
   * 2020-02-26 10:26
   * 
   * Can be overridden. Models like "oauth connected user" needs this to use
   * `schema.index` which pairs a 'key index'.
   * 
   * Use `this.schema` directly.
   */
  modifySchema() {}

  setup() {
    this.modifySchema()
    this.model = mongoose.model(this.model_name, this.schema)
  }
}

export type UserId = string

export type DeleteResult = {
  delete_count: number
}

export interface DeleteUser {
  deleteUser(user_id:string):Promise<DeleteResult>|DeleteResult
}