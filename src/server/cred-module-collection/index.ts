import { service_credentials_reader } from "~/src/server/service-credential-reader"

import { OAuthBaseClass } from "gyst-cred-module-suite"

import { Bitbucket } from "gyst-cred-module-suite"
import { Facebook } from "gyst-cred-module-suite"
import { Github } from "gyst-cred-module-suite"
import { Google } from "gyst-cred-module-suite"
import { Reddit } from "gyst-cred-module-suite"
import { Trello } from "gyst-cred-module-suite"
import { Twitch } from "gyst-cred-module-suite"
import { Twitter } from "gyst-cred-module-suite"

export let cred_module_collection:{ [service_id:string]:OAuthBaseClass } = {}

export function setup() {
  cred_module_collection["bitbucket"] = new Bitbucket("", "")
  cred_module_collection["facebook"] = new Facebook("", "", "")
  cred_module_collection["github"] = new Github("", "", "")
  cred_module_collection["google"] = new Google("", "", "")
  cred_module_collection["reddit"] = new Reddit("", "", "", "")
  cred_module_collection["trello"] = new Trello("", "", "")
  cred_module_collection["twitch"] = new Twitch("", "", "")
  cred_module_collection["twitter"] = new Twitter("", "", "")
}