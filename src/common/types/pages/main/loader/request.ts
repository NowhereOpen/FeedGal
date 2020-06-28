import { PaginationData } from "~/src/server/loader-module-collection/loader-module-base/types"
import { LoadEntryParamDetail } from "~/src/common/types/common/load-entry-param"
import { GystEntryWarning } from "./common"
/**
 * 2020-05-05 09:45 
 * 
 * Same structure as `GystEntryResponseSuccess` but without the two big data
 * which are the entries and service response
 */
export type ServicePaginationReqParam = LoadEntryParamDetail & {
  pagination_data?:PaginationData
  warning?: Omit<GystEntryWarning, "message">
}