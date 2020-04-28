import { GetCredentialFunction } from "~/src/gyst/server/base-class/service-module/get-credential"

import { service_credentials_reader } from "~/src/file-readers/service-credentials"

export const getCredential:GetCredentialFunction = async function getCredential(user_id:string, service_setting_id:string) {
  return service_credentials_reader.getApiKey("dark-sky")
}