import { PaginationOptions } from "~/src/gyst/common/types/gyst-entry"

/**
 * May need to return `new: { before: post_id }, old: { after: post_id }` if `direction` isn't
 * passed for `getServiceEntries`.
 */
export function getPaginationData(res_data:any, pagination_index:number=0):PaginationOptions {
  if(pagination_index == 0) {
    return {
      new: res_data.data.before,
      old: res_data.data.after
    }
  }
  else {
    return {
      // Reddit `data.before` is null for non-pagination request
      new: null,
      old: res_data.data.after
    }
  }
}