import {
  NonOAuthGetEntriesInitParam,  
  NonOAuthPaginationParam,
  NonOAuthValidateSettingValueParam,
  PaginationDirection,
  ServiceInfo,
  LoaderModuleOutput
} from "./types"

export abstract class BaseLoaderModule<
  StaticCredentialData,
  GetEntriesInitParamType,
  GetEntriesPaginationParamType,
  ValidateSettingValueParamType
> {
  static_credential_data:StaticCredentialData
  service_info:ServiceInfo

  constructor(static_credentials:StaticCredentialData, service_info:ServiceInfo) {
    this.static_credential_data = static_credentials
    this.service_info = service_info
  }

  abstract getEntriesInit(param:GetEntriesInitParamType):Promise<LoaderModuleOutput>
  abstract getEntriesPagination(direction:PaginationDirection, pagination_updated_index:number, param:GetEntriesPaginationParamType):Promise<LoaderModuleOutput>
  
  /**
   * 2020-05-04 12:05
   * All services must implement the method. The services that don't support setting values currently WILL
   * use setting values, and this is a planned feature.
   */
  abstract validateSettingValue(param:ValidateSettingValueParamType):Promise<boolean>

  /**
   * 2020-05-04 11:30
   * 
   * Override if needed. Usually not needed when the setting value is a string type.
   * 
   * For example, league of legeneds setting value is consisted of Region and a
   * summoner name, so it is VERY recommended that it overrides this function
   */
  getDisplayedSettingValue(setting_value:any):string { return setting_value }
}

export abstract class NonOAuthLoaderModule<T=any> extends BaseLoaderModule<T, NonOAuthGetEntriesInitParam, NonOAuthPaginationParam, NonOAuthValidateSettingValueParam>{}