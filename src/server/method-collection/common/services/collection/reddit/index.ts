import { ServiceInfo } from "./lib/service-info"
import { getEntries } from "./lib/get-entries"

// Types
import { MethodsOAuth } from "../../base/types"

type Cred = { user_agent:string }
let cred:Cred

export function setupReddit(user_agent:string) {
  cred = { user_agent }
}

export function getMethods():MethodsOAuth {
  const service_info = new ServiceInfo().getServiceInfo()

  const methods:MethodsOAuth = {
    async getEntriesInit(token_data, setting_value) {
      const cred = getRedditCred(token_data)
      return await getEntries(cred)
    },
    async getEntriesPagination(token_data, pagination_param) {
      const { direction, pagination_value } = pagination_param!
      const cred = getRedditCred(token_data)
      const param = { [direction=="old"?"after":"before"]: pagination_value }
      return await getEntries(cred, param)
    },
    getServiceInfo() {
      return service_info
    }
  }

  return methods
}

function getRedditCred(token_data:any) {
  return {
    access_token: token_data.access_token,
    user_agent: cred.user_agent
  }
}