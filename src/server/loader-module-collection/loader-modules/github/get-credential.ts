import { oauth_access_token_storage } from "~/src/models/oauth-access-token"
import { getAccessTokenFromTokenResponse } from "~/src/lib/gyst-entries-helper/services/github"
import { GetCredentialFunction } from "~/src/gyst/server/base-class/service-module/get-credential"

export const getCredential:GetCredentialFunction = async function getCredential(oauth_connected_user_entry_id:string) {
  const token_data = await oauth_access_token_storage!.getTokenData("github", oauth_connected_user_entry_id)
  const access_token = getAccessTokenFromTokenResponse(token_data)
  return access_token
}