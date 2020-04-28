import { PaginationOptions } from "~/src/gyst/common/types/gyst-entry"

/**
 * Needs to be separated into service setting or app setting
 */
const TOTAL_RECORDS_PER_DATA = 5

/**
 * TODO 2019-11-25 00:10 Pagination data is updated even for no or errorneous entries.
 * I don't want to update the pagination data in this case.
 */
export function getPaginationData(pagination_index:number):PaginationOptions {
  const pagination_data = makePaginationData(pagination_index)
  return pagination_data
}

function makePaginationData(pagination_index:number):PaginationOptions {
  const minBeginIndex = 0
  const minEndIndex = TOTAL_RECORDS_PER_DATA
  return {
    old: {
      beginIndex: (pagination_index + 1) * TOTAL_RECORDS_PER_DATA,
      endIndex: (pagination_index + 2) * TOTAL_RECORDS_PER_DATA
    },
    new: {
      beginIndex: Math.max((pagination_index - 1) * TOTAL_RECORDS_PER_DATA, minBeginIndex),
      endIndex: Math.max((pagination_index) * TOTAL_RECORDS_PER_DATA, minEndIndex)
    }
  }
}