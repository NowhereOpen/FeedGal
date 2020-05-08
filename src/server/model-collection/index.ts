// import { setup as setupGystEntryCacheStorage } from "~/src/server/model-collection/models/gyst-entry-cache"
// import { setup as setupGystEntrySavedStorage } from "~/src/server/model-collection/models/gyst-entry-saved"
// import { setup as setupGystEntrySavedUserStorage } from "~/src/server/model-collection/models/gyst-entry-saved-user"
// import { setup as setupGystLoginStorage } from "~/src/server/model-collection/models/gyst-login"
// import { setup as setupGystPostStorage } from "~/src/server/model-collection/models/gyst-post"
// import { setup as setupGystSuiteStorage } from "~/src/server/model-collection/models/gyst-suite"
// import { setup as setupGystSuiteDefaultStorage } from "~/src/server/model-collection/models/gyst-suite-default"
import { setup as setupServiceSettingStorage } from "~/src/server/model-collection/models/service-setting"
import { setup as setuppGystSuiteSettingValueStorage } from "~/src/server/model-collection/models/setting-value"
import { setup as setupUserStorage } from "~/src/server/model-collection/models/user"
// import { setup as setupLoginMethodStorage } from "~/src/server/model-collection/models/login-method"
import { setup as setupOAuthAccessTokenStorage } from "~/src/server/model-collection/models/oauth-access-token"
import { setup as setupOAuthConnectedUserStorage } from "~/src/server/model-collection/models/oauth-connected-user"
// import { setup as setupUserSettingStorage } from "~/src/server/model-collection/models/user-setting"

let model_collection:any = {}

/**
 * 2020-03-03 00:42
 * 
 * Use underscore for the model name because `mongo` terminal auto completes
 * models with underscore, but not for models with hyphen.
 */
export function setup() {
  // setupGystEntryCacheStorage("gyst_entry")
  // setupGystEntrySavedStorage("gyst_entry_saved")
  // setupGystEntrySavedUserStorage("gyst_entry_saved_user")
  // setupGystLoginStorage("gyst_login")
  // setupGystPostStorage("gyst_post")
  // setupGystSuiteStorage("gyst_suite")
  // setupGystSuiteDefaultStorage("gyst_suite_default")
  setupServiceSettingStorage("service_setting")
  setuppGystSuiteSettingValueStorage("setting_value")
  setupUserStorage("gyst_user")
  // setupLoginMethodStorage("login_methods")
  setupOAuthAccessTokenStorage("oauth_access_token")
  setupOAuthConnectedUserStorage("oauth_connected_user")
  // setupUserSettingStorage("user_setting")
}