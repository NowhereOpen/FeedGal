import { Application } from "express"

import { UrlsGystResource } from "~/src/common/urls"

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
  app.post(UrlsGystResource.createNewAccountWithOAuth(), new PostCreateNewAccountRequestHandler().handler())
  app.post(UrlsGystResource.cancelSignupWithOAuth(), new PostCancelSignupWithOAuthRequestHandler().handler())
  app.delete(UrlsGystResource.deleteUser(), new DeleteUserRequestHandler().handler())
  app.post(UrlsGystResource.logout(), new GetLogoutRequestHandler().handler() )

  app.post(UrlsGystResource.disconnectService(":oauth_connected_user_entry_id"), new GetDisconnectServiceRequestHandler().handler())
  app.get(UrlsGystResource.loginWithOAuth(":oauth_service_id"), new RedirectLoginRequestHandler().handler())
  app.get(UrlsGystResource.connectNewAccount(":oauth_service_id"), new RedirectConnectNewAccountRequestHandler().handler())

  app.delete(UrlsGystResource.deleteServiceSetting(":service_setting_id"), new DeleteServiceSettingRequestHandler().handler())
  app.post(UrlsGystResource.addNewServiceSetting(), new PostCreateNewServiceSettingRequestHandler().handler())
  app.get(UrlsGystResource.getGoogleCalendars(":service_setting_id"), new GetGoogleCalendarsRequestHandler().handler())


  app.delete(UrlsGystResource.deleteSettingValue(":setting_value_id"), new DeleteSettingValueRequestHandler().handler())
  app.patch(UrlsGystResource.updateSettingValue(":setting_value_id"), new PatchUpdateSettingValueRequestHandler().handler())
  app.post(UrlsGystResource.addNewSettingValue(), new PostCreateNewSettingValueRequestHandler().handler())

  app.get(UrlsGystResource.oauthCallback(":service_id"), new RedirectHandleOAuthCallbackRequestHandler().handler())
}