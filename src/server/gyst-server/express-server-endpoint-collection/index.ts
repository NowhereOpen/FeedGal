import { Application, Request, Response, NextFunction } from "express"

import { UrlsGystResource } from "~/src/common/urls"

import { UserType } from "./endpoint-base/session"
import { ErrorHandler } from "./endpoint-base/error-handler"

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

export function setup(app:Application) {
  // Login and signup
  app.post(UrlsGystResource.createNewAccountWithOAuth(), new PostCreateNewAccountRequestHandler(UserType.ANON_ONLY).handler())
  app.post(UrlsGystResource.cancelSignupWithOAuth(), new PostCancelSignupWithOAuthRequestHandler(UserType.ANON_ONLY).handler())

  // Account
  app.post(UrlsGystResource.disconnectService(":oauth_connected_user_entry_id"), new GetDisconnectServiceRequestHandler(UserType.USER_ONLY).handler())
  app.delete(UrlsGystResource.deleteUser(), new DeleteUserRequestHandler(UserType.USER_ONLY).handler())
  app.post(UrlsGystResource.logout(), new GetLogoutRequestHandler(UserType.USER_ONLY).handler() )

  // OAUTH
  app.get(UrlsGystResource.oauthCallback(":service_id"), new RedirectHandleOAuthCallbackRequestHandler(UserType.BOTH).handler())
  app.get(UrlsGystResource.connectNewAccount(":oauth_service_id"), new RedirectConnectNewAccountRequestHandler(UserType.USER_ONLY).handler())
  app.get(UrlsGystResource.loginWithOAuth(":oauth_service_id"), new RedirectLoginRequestHandler(UserType.ANON_ONLY).handler())

  // Service setting
  app.delete(UrlsGystResource.deleteServiceSetting(":service_setting_id"), new DeleteServiceSettingRequestHandler(UserType.USER_ONLY).handler())
  app.post(UrlsGystResource.addNewServiceSetting(), new PostCreateNewServiceSettingRequestHandler(UserType.USER_ONLY).handler())
  app.get(UrlsGystResource.getGoogleCalendars(":service_setting_id"), new GetGoogleCalendarsRequestHandler(UserType.USER_ONLY).handler())

  // Setting value
  app.delete(UrlsGystResource.deleteSettingValue(":setting_value_id"), new DeleteSettingValueRequestHandler(UserType.USER_ONLY).handler())
  app.patch(UrlsGystResource.updateSettingValue(":setting_value_id"), new PatchUpdateSettingValueRequestHandler(UserType.USER_ONLY).handler())
  app.post(UrlsGystResource.addNewSettingValue(), new PostCreateNewSettingValueRequestHandler(UserType.USER_ONLY).handler())

  // Error handler
  app.use(new ErrorHandler().handler())
}