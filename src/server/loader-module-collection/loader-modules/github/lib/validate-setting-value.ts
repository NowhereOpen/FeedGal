import * as _ from "lodash"

import { getUserInfo, getRepo } from "~/src/server/lib/loader-module-helpers/services/github"
import {
  SettingValueValidationBase,
  ResDataForValidation,
  ControlledError
} from "~/src/server/loader-module-collection/loader-module-base/setting-value-validation-base"

export class GithubSettingValueValidation extends SettingValueValidationBase {
  access_token:string
  constructor(access_token:string, setting_value:string) {
    super(setting_value)
    this.access_token = access_token
  }

  async getSettingValueData() {    
    const tokens = this.setting_value.split("/")
    const username = tokens[0]
    const repo_name = tokens[1]
    
    // Returns 404 error when repo doesn't exist.
    const repo = await getRepo(this.access_token, username, repo_name)

    /**
     * 2020-03-24 11:36
     * 
     * Github decided to allow "lenient search" when it has a search API. So, when you have
     * `foo-bar` repo, passing `foo` returns `foo-bar` instead of an error. ... Why?
     */
    if(repo.full_name != this.setting_value) {
      const error = new ControlledError(`Did you mean '${repo.name}'? Please use the exact repo name.`)
      throw error
    }
    
    /**
     * 2020-05-15 15:43 
     * 
     * Github is the only service that requires a 'username' when getting entries. Making a request to get
     * user name everytime it gets entries (init and pagination) is a waste of quota, so store it as setting value.
     * 
     * `repo.owner.login` is the 'username' that github can use.
     */
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