import { GetCredentialFunction } from "~/src/gyst/server/base-class/service-module/get-credential"

import { oauth_access_token_storage } from "~/src/models/oauth-access-token"
import { service_credentials_reader } from "~/src/file-readers/service-credentials"

export const getCredential:GetCredentialFunction = async function getCredential(oauth_connected_user_entry_id:string) {
  const token_data = await oauth_access_token_storage.getTokenData("trello", oauth_connected_user_entry_id)
  const access_token = token_data["oauth_token"]
  const consumer_key = service_credentials_reader.getConsumerKey("trello")
  return { access_token, consumer_key }
}