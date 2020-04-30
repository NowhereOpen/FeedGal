import { DeleteUser, DeleteResult } from "~/src/server/model-collection/model-base"

export type UserInfo = { friendly_name:string }

export interface IGystUser extends DeleteUser {
  createNewGystUser(user_info:UserInfo):Promise<string> | string
  updateUserInfo(entry_id:string, user_info:UserInfo):Promise<any> | any
  userExists(entry_id:string):Promise<boolean> | boolean
  getUserInfo(entry_id:string):Promise<any> | any
}