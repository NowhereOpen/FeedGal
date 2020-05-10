import * as _ from "lodash"

import { getUserInfo, getRepo } from "~/src/server/lib/loader-module-helpers/services/github"
import {
  SettingValueValidationBase,
  ResDataForValidation,
  ControlledError
} from "~/src/server/loader-module-collection/loader-module-base/setting-value-validation-base"

export class GithubSettingValueValidation extends SettingValueValidationBase {
  access_token:string
  constructor(access_token:string, setting_value:any) {
    super(setting_value)
    this.access_token = access_token
  }

  async getSettingValueData() {    
    const user = await getUserInfo(this.access_token)
    const username = user.login
    
    // Returns 404 error when repo doesn't exist.
    const repo = await getRepo(this.access_token, username, this.setting_value)

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