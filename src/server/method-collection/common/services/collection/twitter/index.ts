import { ServiceInfo } from "./lib/service-info"
import { getEntries } from "./lib/get-entries"

// Types
import { MethodsOAuth } from "../../base/types"

type TwitterCred = {
  consumer_key:string
  consumer_secret:string
}

let cred:TwitterCred

export function setupTwitter(consumer_key:string, consumer_secret:string) {
  cred = { consumer_key, consumer_secret }
}

export function getMethods():MethodsOAuth {
  const service_info = new ServiceInfo().getServiceInfo()

  const methods:MethodsOAuth = {
    async getEntriesInit(token_data, setting_value) {
      const cred = getTwitterCred(token_data)
      return await getEntries(cred)
    },
    async getEntriesPagination(token_data, pagination_param) {
      const { direction, pagination_value } = pagination_param!
      const cred = getTwitterCred(token_data)
      const param = { [direction=="old"?"max_id":"since_id"]: pagination_value }

      const output = await getEntries(cred, param)

      if(direction == "old") {
        output.entries.shift()
      }

      return output
    },
    getServiceInfo() {
      return service_info
    }
  }

  return methods
}

function getTwitterCred(token_data:any) {
  const user_cred = {
    access_token_key: token_data.oauth_token,
    access_token_secret: token_data.oauth_token_secret
  }
  // consumer_key
  // consumer_secret
  // access_token_key
  // access_token_secret
  return Object.assign(user_cred, cred)
}