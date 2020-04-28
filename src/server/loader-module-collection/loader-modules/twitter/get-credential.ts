import { GetCredentialFunction } from "~/src/gyst/server/base-class/service-module/get-credential"

import { oauth_access_token_storage } from "~/src/models/oauth-access-token"
import { service_credentials_reader } from "~/src/file-readers/service-credentials"

export const getCredential:GetCredentialFunction = async function getCredential(oauth_connected_user_entry_id:string) {
  const token_data = await oauth_access_token_storage.getTokenData("twitter", oauth_connected_user_entry_id)
  const consumer_key = service_credentials_reader.getConsumerKey("twitter")
  const consumer_secret = service_credentials_reader.getConsumerSecret("twitter")
  const access_token_key = token_data["oauth_token"]
  const access_token_secret = token_data["oauth_token_secret"]

  return {
    consumer_key, consumer_secret,
    access_token_key, access_token_secret
  }
}