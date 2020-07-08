import { Application, Request, Response, NextFunction } from "express"

import { UrlsGystResource } from "~/src/common/urls"

import { UserType } from "./endpoint-base/session"
import { ErrorHandler } from "./endpoint-base/error-handler"

import { ExpressRequest } from "~/src/server/gyst-server/express-server-endpoint-collection/endpoint-base/base"

import { PostCancelSignupWithOAuthRequestHandler } from "./endpoints/account-signup/oauth-cancel-post"
import { PostCreateNewAccountRequestHandler } from "./endpoints/account-signup/oauth-post"

import { RedirectHandleOAuthCallbackRequestHandler } from "./endpoints/oauth/callback-handler-redirect"
import { RedirectLoginRequestHandler } from "./endpoints/oauth/oauth-auth-redirect"
import { RedirectConnectNewAccountRequestHandler } from "./endpoints/oauth/connect-account-redirect"

import { GetDisconnectServiceRequestHandler } from "./endpoints/user/accounts/disconnect-post"
import { GetLogoutRequestHandler } from "./endpoints/user/logout-post"
import { DeleteUserRequestHandler } from "./endpoints/user/user-delete"

import { DeleteServiceSettingRequestHandler } from "./endpoints/service-setting/delete-service-setting"
import { PostCreateNewServiceSettingRequestHandler } from "./endpoints/service-setting/post-create-new-service-setting"
import { GetGoogleCalendarsRequestHandler } from "./endpoints/service-setting/get-google-calendars"

import { DeleteSettingValueRequestHandler } from "./endpoints/setting-value/delete-setting-value"
import { PatchUpdateSettingValueRequestHandler } from "./endpoints/setting-value/patch-update-setting-value"
import { PostCreateNewSettingValueRequestHandler } from "./endpoints/setting-value/post-create-new-setting-value"

/**
 * 2020-07-08 16:18
 * 
 * Need this utility function to avoid having millions of `() => new ...(...).handle()`
 * 
 * And such pattern is REQUIRED because we don't want to keep the data from the previous request. I can't
 * believe I didn't think of this beforehand.
 */
function handleFactory(makeInstance:() => ExpressRequest) {
  return async (req:Request, res:Response) => {
    const inst = makeInstance()
    await inst.handle(req, res)
  }
}

export function setup(app:Application) {
  // Login and signup
  app.post(UrlsGystResource.createNewAccountWithOAuth(), handleFactory(() => new PostCreateNewAccountRequestHandler(UserType.ANON_ONLY)))
  app.post(UrlsGystResource.cancelSignupWithOAuth(), handleFactory(() => new PostCancelSignupWithOAuthRequestHandler(UserType.ANON_ONLY)))

  // Account
  app.post(UrlsGystResource.disconnectService(":oauth_connected_user_entry_id"), handleFactory(() => new GetDisconnectServiceRequestHandler(UserType.USER_ONLY)))
  app.delete(UrlsGystResource.deleteUser(), handleFactory(() => new DeleteUserRequestHandler(UserType.USER_ONLY)))
  app.post(UrlsGystResource.logout(), handleFactory(() => new GetLogoutRequestHandler(UserType.USER_ONLY)) )

  // OAUTH
  app.get(UrlsGystResource.oauthCallback(":service_id"), handleFactory(() => new RedirectHandleOAuthCallbackRequestHandler(UserType.BOTH)))
  app.get(UrlsGystResource.connectNewAccount(":oauth_service_id"), handleFactory(() => new RedirectConnectNewAccountRequestHandler(UserType.USER_ONLY)))
  app.get(UrlsGystResource.loginWithOAuth(":oauth_service_id"), handleFactory(() => new RedirectLoginRequestHandler(UserType.ANON_ONLY)))

  // Service setting
  app.delete(UrlsGystResource.deleteServiceSetting(":service_setting_id"), handleFactory(() => new DeleteServiceSettingRequestHandler(UserType.USER_ONLY)))
  app.post(UrlsGystResource.addNewServiceSetting(), handleFactory(() => new PostCreateNewServiceSettingRequestHandler(UserType.USER_ONLY)))
  app.get(UrlsGystResource.getGoogleCalendars(":service_setting_id"), handleFactory(() => new GetGoogleCalendarsRequestHandler(UserType.USER_ONLY)))

  // Setting value
  app.delete(UrlsGystResource.deleteSettingValue(":setting_value_id"), handleFactory(() => new DeleteSettingValueRequestHandler(UserType.USER_ONLY)))
  app.patch(UrlsGystResource.updateSettingValue(":setting_value_id"), handleFactory(() => new PatchUpdateSettingValueRequestHandler(UserType.USER_ONLY)))
  app.post(UrlsGystResource.addNewSettingValue(), handleFactory(() => new PostCreateNewSettingValueRequestHandler(UserType.USER_ONLY)))

  /**
   * 2020-07-08 16:37
   * 
   * Not using the `handleFactory` because error handlers have different form. But still instantiating `ErrorHandler`
   * for each request.
   */
  // Error handler
  app.use((error:any, req:Request, res:Response, next:NextFunction) => new ErrorHandler(error).handle(req, res))
}