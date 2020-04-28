import { GetCredentialFunction } from "~/src/gyst/server/base-class/service-module/get-credential"

import { getAccessTokenCommon } from "~/src/models/oauth-access-token"
import { service_credentials_reader } from "~/src/file-readers/service-credentials"

export const getCredential:GetCredentialFunction = async function getCredential(oauth_connected_user_entry_id:string) {
  const access_token = await getAccessTokenCommon("reddit", oauth_connected_user_entry_id)
  const user_agent = service_credentials_reader.getExtraProp("reddit", ["user-agent"])
  return { access_token, user_agent }
}