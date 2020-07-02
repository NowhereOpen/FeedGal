import moment from "moment"

import { ServiceInfo } from "./lib/service-info"
import { getEntries } from "./lib/get-entries"

// Types
import { MethodsOAuth } from "../../base/types"

export function getMethods():MethodsOAuth {
  const service_info = new ServiceInfo().getServiceInfo()

  const methods:MethodsOAuth = {
    async getEntriesInit(token_data, setting_value) {
      const default_range = {
        from_moment: moment().subtract(7, "days"),
        to_moment: moment()
      }

      return await getEntries(token_data.access_token, default_range)
    },
    async getEntriesPagination(token_data, pagination_param) {
      const { pagination_value } = pagination_param!
      const date_range = {
        from_moment: moment(pagination_value.from_moment),
        to_moment: moment(pagination_value.to_moment)
      }
      return await getEntries(token_data.access_token, date_range)
    },
    getServiceInfo() {
      return service_info
    }
  }

  return methods
}