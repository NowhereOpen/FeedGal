import * as _ from "lodash"

import { getUserInfo, getRepo } from "~/src/server/lib/loader-module-helpers/services/github"
import {
  SettingValueValidationBase,
  ResDataForValidation
} from "../../../base/setting-value-validation-base"

import { GithubSettingValue as SettingValue } from "~/src/common/types/common/setting-value"
import { getOwnerFromSettingValue } from "./utility"
import { GithubInvalidReason, InvalidReason } from "~/src/common/types/common/setting-value-validation"
import { Github } from "~/src/common/setting-value-validation/validate"
import { Github as ValidationObjects } from "~/src/common/setting-value-validation/validation-object"

export class GithubSettingValueValidation extends SettingValueValidationBase<SettingValue> {
  access_token:string

  owner_name:string
  repo_name:string

  constructor(access_token:string, setting_value:SettingValue) {
    super(setting_value)
    this.owner_name = getOwnerFromSettingValue(this.setting_value)
    this.repo_name = this.setting_value.repo
    this.access_token = access_token
  }

  async getSettingValueData() {    
    // Returns 404 error when repo doesn't exist.
    const repo = await getRepo(this.access_token, this.owner_name, this.repo_name)
    
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

  convertErrorToInvalidReason(error:any) {
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
        return ValidationObjects.REPOSITORY_NOT_FOUND()
      }
    }
  }

  validate(repo:any) {
    /**
     * 2020-03-24 11:36
     * 
     * Github decided to allow "lenient search" when it has a search API. So, when you have
     * `foo-bar` repo, passing `foo` returns `foo-bar` instead of an error. ... Why?
     */
    if(repo.name != this.repo_name || repo.owner.login != this.owner_name) {
      return ValidationObjects.EXACT_REPO_NAME_REQUIRED(repo.name)
    }
  }

  preValidate() {
    return Github.validate(this.setting_value)
  }
}