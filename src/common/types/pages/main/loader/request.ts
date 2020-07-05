import { PaginationData } from "~/src/server/method-collection/common/services/base/types"
import { SuiteEntry } from "~/src/common/types/common/suite"
import { WarningObject } from "~/src/common/types/common/warning-error"
/**
 * 2020-05-05 09:45 
 * 
 * Same structure as `GystEntryResponseSuccess` but without the two big data
 * which are the entries and service response
 */
export type ServicePaginationReqParam = SuiteEntry & {
  pagination_data?:PaginationData
  warning?: Omit<WarningObject, "message">
}