import { GetCredentialFunction } from "~/src/gyst/server/base-class/service-module/get-credential"

import { oauth_access_token_storage } from "~/src/models/oauth-access-token"
import { service_credentials_reader } from "~/src/file-readers/service-credentials"

export const getCredential:GetCredentialFunction = async function getCredential(user_id:string) {
  
}