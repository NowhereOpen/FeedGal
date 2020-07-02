import { ServiceInfo } from "./lib/service-info"
import { getEntries } from "./lib/get-entries"

// Types
import { MethodsOAuth } from "../../base/types"

type Cred = { client_id:string }
let cred:Cred

export function setupTwitch(client_id:string) {
  cred = { client_id }
}

export function getMethods():MethodsOAuth {
  const service_info = new ServiceInfo().getServiceInfo()

  const methods:MethodsOAuth = {
    async getEntriesInit(token_data, setting_value) {
      const cred = getTwitchCred(token_data)
      return await getEntries(cred, 0)
    },
    async getEntriesPagination(token_data, pagination_param) {
      const cred = getTwitchCred(token_data)
      return await getEntries(cred, 1)
    },
    getServiceInfo() {
      return service_info
    }
  }

  return methods
}

function getTwitchCred(token_data:any) {
  return {
    access_token: token_data.access_token,
    client_id: cred.client_id
  }
}