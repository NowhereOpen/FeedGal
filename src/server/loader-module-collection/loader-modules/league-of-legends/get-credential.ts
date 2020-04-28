import { GetCredentialFunction2 } from "~/src/gyst/server/base-class/service-module/get-credential"
import { service_credentials_reader } from "~/src/file-readers/service-credentials"

export const getCredential:GetCredentialFunction2 = async () => {
  const api_key = service_credentials_reader.getApiKey("riot")
  return api_key
}