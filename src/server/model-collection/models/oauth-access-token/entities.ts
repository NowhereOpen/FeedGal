import { DeleteUser, DeleteResult } from "~/src/server/model-collection/model-base"

export interface IOAuthAccessToken extends DeleteUser {
  /**
   * OAuth1 methods. The 'token data' used in `auth_url`. In OAuth1,
   * the 'token data' are required before the 'auth url'.
   */
  getOAuth1Token:(service_id:string, oauth_connected_user_entry_id:string) => Promise<any> | any
  storeOAuth1Token:(service_id:string, oauth_connected_user_entry_id:string, token:string, token_secret:string) => Promise<any> | any

  /**
   * Access token and token data that stores `access_token` used in requests.
   */
  getAccessTokenEntry:(service_id:string, oauth_connected_user_entry_id:string) => Promise<any> | any
  getTokenData:(service_id:string, oauth_connected_user_entry_id:string) => Promise<any> | any
  storeTokenData:(service_id:string, oauth_connected_user_entry_id:string, token_data:any) => Promise<any> | any
  refreshAccessToken:(service_id:string, oauth_connected_user_entry_id:string, token_data:any) => Promise<any> | any
  invalidateAccessToken:(service_id:string, oauth_connected_user_entry_id:string) => Promise<any> | any
  
  getTimeInfo:(service_id:string, oauth_connected_user_entry_id:string) => Promise<any> | any
  tokenExists:(service_id:string, oauth_connected_user_entry_id:string) => Promise<boolean> | boolean

  /**
   * Used by the backend when retrieving gyst entries where it doesn't need to care about
   * invalid tokens. The frontend need to inform the user about this and users can take
   * actions, so invalid tokens are also sent for the frontend usage.
   */
  getValidTokenEntries: (user_id:string) => Promise<any[]> | any[]

  // Useful in testing
  getTotalUserTokens:(user_id:string) => Promise<number> | number
}