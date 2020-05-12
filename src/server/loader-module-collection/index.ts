import {
  PaginationDirection,
  LoaderModuleOutput,
  ValidationResult,
  PaginationData,
} from "./loader-module-base/types"

import { NonOAuthLoaderModule } from "./loader-module-base/base"
import { OAuthBaseLoaderModule } from "./loader-module-base/oauth"

import { loader_collection } from "./collection"

/**
 * EXPORTED
 * ====================
 */


export { setup } from "./collection"

export function getDisplayedSettingValue(service_id:string, setting_value:any) {
  return loader_collection[service_id].getDisplayedSettingValue(setting_value)
}

export function getServiceInfo(service_id:string) {
  return loader_collection[service_id].service_info
}

export async function getEntriesInitOAuth(service_id:string, token_data:any, setting_value:any):Promise<LoaderModuleOutput> {
  const result:LoaderModuleOutput = await (loader_collection[service_id] as OAuthBaseLoaderModule).getEntriesInit({
    token_data, setting_value
  })
  return result
}

export async function getEntriesInitNonOAuth(service_id:string, setting_value:any):Promise<LoaderModuleOutput> {
  const result = await (loader_collection[service_id] as NonOAuthLoaderModule).getEntriesInit({ setting_value })
  return result
}

export async function getEntriesPaginationOAuth(
  service_id:string,
  direction:PaginationDirection,
  pagination_updated_index:number,
  pagination_data:PaginationData,
  token_data:any,
  setting_value?:any
):Promise<LoaderModuleOutput> {
  let result:LoaderModuleOutput = await (loader_collection[service_id] as OAuthBaseLoaderModule).getEntriesPagination(
    direction,
    pagination_updated_index,
    { pagination_data, setting_value, token_data }
  )

  return result!
}

export async function getEntriesPaginationNonOAuth(
  service_id:string,
  direction:PaginationDirection,
  pagination_updated_index:number,
  pagination_data:PaginationData,
  setting_value?:any
):Promise<LoaderModuleOutput> {
  const result = await (loader_collection[service_id] as NonOAuthLoaderModule).getEntriesPagination(
    direction,
    pagination_updated_index,
    { pagination_data, setting_value }
  )
  return result
}

export async function validateSettingValueNonOAuth(service_id:string, setting_value:any):Promise<ValidationResult> {
  const result:ValidationResult = await (loader_collection[service_id] as NonOAuthLoaderModule).validateSettingValue({ setting_value })
  return result!
}

export async function validateSettingValueOAuth(service_id:string, token_data:any, setting_value:any):Promise<ValidationResult> {
  const result:ValidationResult = await (loader_collection[service_id] as OAuthBaseLoaderModule).validateSettingValue({ setting_value, token_data })
  return result!
}