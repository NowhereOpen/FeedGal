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

export function setup(app:Application) {
  app.post(UrlsGystResource.createNewAccountWithOAuth(), new PostCreateNewAccountRequestHandler().handler())
  app.post(UrlsGystResource.cancelSignupWithOAuth(), new PostCancelSignupWithOAuthRequestHandler().handler())
  app.delete(UrlsGystResource.deleteUser(), new DeleteUserRequestHandler().handler())
  app.post(UrlsGystResource.logout(), new GetLogoutRequestHandler().handler() )

  app.post(UrlsGystResource.disconnectService(":oauth_connected_user_entry_id"), new GetDisconnectServiceRequestHandler().handler())
  app.get(UrlsGystResource.loginWithOAuth(":oauth_service_id"), new RedirectLoginRequestHandler().handler())
  app.get(UrlsGystResource.connectNewAccount(":oauth_service_id"), new RedirectConnectNewAccountRequestHandler().handler())

  app.get(UrlsGystResource.oauthCallback(":service_id"), new RedirectHandleOAuthCallbackRequestHandler().handler())
}