import { GetCredentialFunction } from "~/src/gyst/server/base-class/service-module/get-credential"
import { getAccessTokenCommon } from "~/src/models/oauth-access-token"

export const getCredential:GetCredentialFunction = async function getCredential(oauth_connected_user_entry_id:string) {
  const access_token = await getAccessTokenCommon("google", oauth_connected_user_entry_id)
  return access_token
}