import { ServiceInfo } from "./lib/service-info"
import { getEntries } from "./lib/get-entries"

// Types
import { MethodsOAuth } from "../../base/types"

type Cred = { consumer_key:string }
let cred:Cred

export function setupTrello(consumer_key:string) {
  cred = { consumer_key }
}

export function getMethods():MethodsOAuth {
  const service_info = new ServiceInfo().getServiceInfo()

  const methods:MethodsOAuth = {
    async getEntriesInit(token_data, setting_value) {
      const cred = getTrelloCred(token_data)
      return await getEntries(cred)
    },
    async getEntriesPagination(token_data, pagination_param) {
      const cred = getTrelloCred(token_data)
      const { direction, pagination_value } = pagination_param!
      const param = { [direction=="old"?"before":"since"]: pagination_value }
      return await getEntries(cred, param)
    },
    getServiceInfo() {
      return service_info
    }
  }

  return methods
}

function getTrelloCred(token_data:any) {
  return {
    access_token: token_data.oauth_token,
    consumer_key: cred.consumer_key
  }
}