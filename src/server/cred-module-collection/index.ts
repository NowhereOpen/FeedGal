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

export let cred_module_collection:{ [service_id:string]: OAuthBaseClass } = {}

export function setup() {
  cred_module_collection["bitbucket"] = getBitbucket()
  cred_module_collection["facebook"] = getFacebook()
  cred_module_collection["github"] = getGithub()
  cred_module_collection["google"] = getGoogle()
  cred_module_collection["reddit"] = getReddit()
  cred_module_collection["trello"] = getTrello()
  cred_module_collection["twitch"] = getTwitch()
  cred_module_collection["twitter"] = getTwitter()
}

function getBitbucket() {
  const service_id = "bitbucket"
  const client_id = service_credentials_reader.getClientId(service_id)
  const client_secret = service_credentials_reader.getClientSecret(service_id)
  const instance = new Bitbucket(client_id, client_secret)
  return instance
}

function getFacebook() {
  const service_id = "facebook"
  const client_id = service_credentials_reader.getClientId(service_id)
  const client_secret = service_credentials_reader.getClientSecret(service_id)
  const instance = new Facebook(client_id, client_secret, redirect_url)
  return instance
}

function getGithub() {
  const service_id = "github"
  const client_id = service_credentials_reader.getClientId(service_id)
  const client_secret = service_credentials_reader.getClientSecret(service_id)
  const instance = new Github(client_id, client_secret, redirect_url)
  return instance
}

function getGoogle() {
  const service_id = "google"
  const client_id = service_credentials_reader.getClientId(service_id)
  const client_secret = service_credentials_reader.getClientSecret(service_id)
  const instance = new Google(client_id, client_secret, redirect_url)
  return instance
}

function getReddit() {
  const service_id = "reddit"
  const client_id = service_credentials_reader.getClientId(service_id)
  const client_secret = service_credentials_reader.getClientSecret(service_id)
  const user_agent = service_credentials_reader.getExtraProp(service_id, ["user-agent"])
  const instance = new Reddit(client_id, client_secret, user_agent, redirect_url)
  return instance
}

function getTrello() {
  const service_id = "trello"
  const consumer_key = service_credentials_reader.getConsumerKey(service_id)
  const consumer_secret = service_credentials_reader.getConsumerSecret(service_id)
  const instance = new Trello(consumer_key, consumer_secret, redirect_url)
  return instance
}

function getTwitch() {
  const service_id = "twitch"
  const client_id = service_credentials_reader.getClientId(service_id)
  const client_secret = service_credentials_reader.getClientSecret(service_id)
  const instance = new Twitch(client_id, client_secret, redirect_url)
  return instance
}

function getTwitter() {
  const service_id = "twitter"
  const consumer_key = service_credentials_reader.getConsumerKey(service_id)
  const consumer_secret = service_credentials_reader.getConsumerSecret(service_id)
  const instance = new Twitter(consumer_key, consumer_secret, redirect_url)
  return instance
}