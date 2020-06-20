import { DeleteUser, DeleteResult, UserId } from "~/src/server/model-collection/model-base"

export type UserInfo = { user_uid:string, user_id?:string, friendly_name?:string }

export interface IOAuthConnectedUser extends DeleteUser {
  // Create (2)
  connectAsSignup(user_id:UserId, service_id:string, user_info:UserInfo, user_info_result:any):Promise<string>
  connect(user_id:UserId, service_id:string, user_info:UserInfo, user_info_result:any):Promise<string>
  
  getEntry(entry_id:string): Promise<any>
  getEntryIds(service_id:string, user_uid:string):Promise<string[]>
  getAllEntriesForUserId(user_id:string):Promise<any[]>
  
  /**
   * Uses entry id
   */
  isSignup(entry_id:string):Promise<boolean>
  getUserInfoCache(entry_id:string):Promise<any>
  
  /**
   * Uses gyst user id. Uses service id and its related data such as user_uid
   */
  getAllConnectedServiceIds(user_id:UserId):Promise<string[]>
  getAllConnectedAccountsForServiceId(user_id:UserId, service_id:string):Promise<any[]>
  getAllAliveAccounts(user_id:UserId):Promise<any[]>
  isServiceAlreadyConnected(user_id:UserId, service_id:string):Promise<boolean>
  isServiceAccountAlreadyConnected(user_id:UserId, service_id:string, user_uid:string):Promise<boolean>
  getSignupEntry(service_id:string, user_uid:string):Promise<any>
  getEntryWithUserUid(service_id:string, user_uid:string):Promise<any>
  userConnected(service_id:string, user_uid:string):Promise<boolean>
  serviceConnected(service_id:string, user_id:UserId):Promise<boolean>
  isErrorWithUserUid(service_id:string, user_uid:string):Promise<boolean>

  countSignupAccounts(service_id:string):Promise<number>
  countConnectedAccounts(service_id:string):Promise<number>
  countConnected(service_id:string):Promise<number>

  // Delete/Update
  disconnect(entry_id:string):Promise<any>
  setError(entry_id:string, value:boolean):Promise<any>

  /**
   * 2020-03-05 23:17
   * 
   * Checking if user_id (gyst_user) and service_id pair exists is used for `/settings/gyst-suites`
   * service setting editor. When at least one account from a service is connected, then the editor
   * shows "Choose account". Elses, it will show "connect service". Done with `isServiceAlreadyConnected`.
   * 
   * Checking if user_id, service_id, and user_uid (unique id from  the service) exists is used for
   * preventing connecting duplicate account for the gyst user. Multiple accounts from same service
   * is allowed, but duplicate account is ... wtf. Done with `isServiceAccountAlreadyConnected`
   * 
   * So, remove `isAlreadyConnected`.
   */
  isAlreadyConnected(user_id:UserId, service_id:string):Promise<boolean>
}