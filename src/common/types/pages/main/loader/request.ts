import { PaginationData } from "~/src/server/method-collection/common/services/base/types"
import { LoadEntryParamDetail } from "~/src/common/types/common/load-entry-param"
import { Warning } from "~/src/common/types/common/warning-error"
/**
 * 2020-05-05 09:45 
 * 
 * Same structure as `GystEntryResponseSuccess` but without the two big data
 * which are the entries and service response
 */
export type ServicePaginationReqParam = LoadEntryParamDetail & {
  pagination_data?:PaginationData
  warning?: Omit<Warning, "message">
}