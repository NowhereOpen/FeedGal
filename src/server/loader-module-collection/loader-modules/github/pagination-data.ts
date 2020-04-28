import { PaginationOptions } from "~/src/gyst/common/types/gyst-entry"

export function getPaginationData(pagination_index:number, pagination_value:any):PaginationOptions {
  if(pagination_index == 0) {
    /**
     * The first page starts at 1.
     * 
     * Ref: https://developer.github.com/v3/guides/traversing-with-pagination/
     */
    return { old: 2, new: null }
  }
  else {
    return {
      old: pagination_value + 1,
      new: pagination_value - 1
    }
  }
}