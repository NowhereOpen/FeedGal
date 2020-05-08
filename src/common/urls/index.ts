/**
 * Used on server side to setup end points. Pass `":param_name"`, an express
 * url param format as an argument.
 * 
 * Used on client side to make request.
 * 
 * 2020-04-30 11:21
 * 
 * Updating the returned string in the file SHOULD NOT have any problem when running the server.
 * This file abstracts the url used on the server and the requests that the client app makes.
 * 
 * It would definitely be a problem if a developer user makes request to an endpoint using a
 * literal url. And that's too far in the future.
 */

export class UrlsGystResource {
  /**
   * ================================================
   * PAGES
   */
  static mainPage() {
    return "/"
  }

  static oauthSignupPage() {
    return "/signup/oauth"
  }

  static createNewAccountWithOAuth() {
    return "/signup/oauth"
  }

  static cancelSignupWithOAuth() {
    return "/signup/oauth/cancel"
  }

  static loginPage() {
    return "/login"
  }

  static userPage() {
    return "/user"
  }

  static userServiceAccountsPage() {
    return "/user/accounts"
  }

  /**
   * =============================================
   * SERVER APIS
   */

  static deleteUser() {
    return "/user/delete"
  }

  static logout() {
    return "/user/logout"
  }

  static connectServicesPage() {
    return "/user/accounts"
  }
  
  /**
   * 2020-04-29 11:09
   * 
   * Note that the parameter CANNOT be just a `service_id` because GYST allows for multiple accounts from
   * a same service to be signed up. The parameter `oauth_connected_user_entry_id` will be included in the
   * page when the user visits the page where one can disconnect.
   */
  static disconnectService(oauth_connected_user_entry_id:string) {
    return `/user/accounts/${oauth_connected_user_entry_id}/revoke`
  }

  static connectNewAccount(oauth_service_id:string) {
    return `/oauth/${oauth_service_id}/auth`
  }

  static oauthCallback(service_id:string) {
    return `/oauth/${service_id}/callback`
  }

  /**
   * 
   */

  static oauthAuthentication(oauth_service_id:string) {
    return `/login/oauth/${oauth_service_id}`
  }
}