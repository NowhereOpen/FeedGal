import { RefreshTokenIfFailTask } from "gyst-cred-module-suite"

import { cred_module_collection } from "../cred-module-collection"

import { BaseLoaderModule } from "./loader-module-base/base"
import {
  PaginationDirection,
  LoaderModuleOutput,
  NonOAuthGetEntriesInitParam,
  OAuthGetEntriesInitParam,

  NonOAuthPaginationParam,
  OAuthPaginationParam,
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

export type GetEntriesInitParam = NonOAuthGetEntriesInitParam | OAuthGetEntriesInitParam

export async function getEntriesInit(service_id:string, param:GetEntriesInitParam):Promise<LoaderModuleOutput> {  
  let result:LoaderModuleOutput
  
  await __handleAllCases(service_id, async (is_oauth, loader) => {
    if(is_oauth) {
      result = await (loader_collection[service_id] as OAuthBaseLoaderModule).getEntriesInit(<OAuthGetEntriesInitParam>param)
    }
    else {
      result = await (loader_collection[service_id] as NonOAuthLoaderModule).getEntriesInit(<NonOAuthGetEntriesInitParam>param)
    }
  })

  return result!
}

export type GetEntriesPaginationParam = NonOAuthPaginationParam | OAuthPaginationParam

export async function getEntriesPagination(
  service_id:string,
  direction:PaginationDirection,
  pagination_updated_index:number,
  param:GetEntriesPaginationParam
):Promise<LoaderModuleOutput> {
  let result:LoaderModuleOutput

  await __handleAllCases(service_id, async (is_oauth, loader) => {
    if(is_oauth) {
      result = await (loader_collection[service_id] as OAuthBaseLoaderModule).getEntriesPagination(
        direction,
        pagination_updated_index,
        <OAuthPaginationParam> param
      )
    }
    else {
      result = await (loader_collection[service_id] as NonOAuthLoaderModule).getEntriesPagination(
        direction,
        pagination_updated_index,
        <NonOAuthPaginationParam>param
      )
    }
  })

  return result!
}

export type ValidateSettingValueParam = {
  service_id:string
  setting_value:any
  token_data?:any
}

export async function validateSettingValue(param:ValidateSettingValueParam):Promise<boolean> {
  const { service_id, setting_value, token_data } = param

  let result:boolean

  await __handleAllCases(service_id, async (is_oauth, loader) => {
    if(is_oauth) {
      result = await (loader_collection[service_id] as OAuthBaseLoaderModule).validateSettingValue({ setting_value, token_data })
    }
    else {
      result = await (loader_collection[service_id] as NonOAuthLoaderModule).validateSettingValue({ setting_value })
    }
  })

  return result!
}

async function __handleAllCases(service_id:string, cb:(is_oauth:boolean, loader:any) => Promise<void>):Promise<void> {
  let loader = loader_collection[service_id]
  const service_info = loader.service_info
  
  if(service_info.is_oauth) {
    loader = <OAuthBaseLoaderModule>loader
    const cred_module = cred_module_collection[<string>service_info.oauth_service_id]
    const task = new RefreshTokenIfFailTask("", cred_module, async () => {
      await cb(true, loader)
    })
    task.useToken()
  }
  else {
    cb(false, loader)
  }
}