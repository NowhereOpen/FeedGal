import { RefreshTokenIfFailTask } from "gyst-cred-module-suite"
import { cred_module_collection } from "~/src/server/cred-module-collection"
import { OAuthBaseLoaderModule } from "~/src/server/loader-module-collection/loader-module-base/oauth"

import { loader_collection } from "~/src/server/loader-module-collection/collection"

export async function refreshTokenIfFail(service_id:string, token_data:any, cb:(loader:OAuthBaseLoaderModule)=>Promise<void>) {
  let loader = loader_collection[service_id]
  const service_info = loader.service_info

  loader = <OAuthBaseLoaderModule>loader
  const cred_module = cred_module_collection[<string>service_info.oauth_service_id]
  /**
   * TODO: Need to pass token data as the first argument.
   */
  const task = new RefreshTokenIfFailTask(token_data, cred_module, async () => {
    await cb(loader)
  })

  await task.useToken()
}