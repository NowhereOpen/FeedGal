import * as _ from "lodash"

import { getUserInfo, getRepo } from "~/src/lib/gyst-entries-helper/services/github"
import {
  SettingValueValidationOAuthBase,
  ResDataForValidation,
  ControlledError
} from "~/src/gyst/server/base-class/service-module/setting-value-validation-base"
import { refreshTokenIfFail } from "~/src/gyst/server/lib/service-module-helper/refresh-token-if-fail"
import { getCredential } from "./get-credential"
import { service_setting_storage } from "~/src/models/gyst-suite-service-setting"

export class GithubSettingValueValidation extends SettingValueValidationOAuthBase {
  getOAuthConnectedUserEntryIdImpl() {
    return service_setting_storage.getOAuthConnectedUserEntryId(this.service_setting_id)
  }

  async getSettingValueData() {
    const oauth_connected_user_entry_id = await this.getOAuthConnectedUserEntryId()

    return await refreshTokenIfFail("github", oauth_connected_user_entry_id, async () => {
      const access_token = await getCredential(oauth_connected_user_entry_id)
      
      const user = await getUserInfo(access_token)
      const username = user.login
      
      // Returns 404 error when repo doesn't exist.
      const repo = await getRepo(access_token, username, this.setting_value)

      /**
       * 2020-03-24 11:36
       * 
       * Github decided to allow "lenient search" when it has a search API. So, when you have
       * `foo-bar` repo, passing `foo` returns `foo-bar` instead of an error. ... Why?
       */
      if(repo.name != this.setting_value) {
        const error = new ControlledError(`Did you mean '${repo.name}'? Please use the exact repo name.`)
        throw error
      }

      return repo
    })
  }

  getErrorMessage(error:any) {
    /**
     * 404 error response with:
     * 
     * data: {
     *   message: 'Not Found',
     *   documentation_url: 'https://developer.github.com/v3/repos/#get'
     * }
     */
    if(_.get(error, "response.status") == "404") {
      if(_.get(error, "response.data.message") == "Not Found") {
        return "The repository wasn't found"
      }
    }
  }

  preValidate() {
    if(this.setting_value.trim() == "") {
      throw new ControlledError("Repo name must not be empty.")
    }
  }
}