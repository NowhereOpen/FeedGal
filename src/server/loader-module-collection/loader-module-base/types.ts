export type PaginationOptions = { new: any, old: any }
export type PaginationDirection = "old" | "new"
export type NonOAuthGetEntriesInitParam = {
  setting_value?:any
}
// /**
//  * 2020-03-21 15:49
//  * The `direction` is included in the request. And because this is
//  * a common type, when the server is sending this back to the client,
//  * the `direction` is nowhere to be used. The `direction` is only
//  * relevent when making a request.
//  */
// export type PaginationParam = {
//   index: number
//   options: PaginationOptions
// }

/**
 * 2020-05-05 09:43 
 * 
 * Used as a part of the response. But the structure of the response should not be
 * considered by `loader-module-collection` module.
 */
/**
 * 2020-03-21 15:49
 * The `direction` is included in the request. And because this is
 * a common type, when the server is sending this back to the client,
 * the `direction` is nowhere to be used. The `direction` is only
 * relevent when making a request.
 */
export type PaginationData = {
  index: number
  options: PaginationOptions
}

export type NonOAuthPaginationParam = {
  pagination_data:PaginationData
  setting_value?:any
}

export type NonOAuthValidateSettingValueParam = {
  setting_value:any
}

export type OAuthGetEntriesInitParam = NonOAuthGetEntriesInitParam & {
  token_data:any
}

export type OAuthPaginationParam = NonOAuthPaginationParam & {
  token_data:any
}
export type OAuthValidateSettingValueParam = NonOAuthValidateSettingValueParam & {
  token_data:any
}

export type ServiceInfo = {
  service_id:string
  name:string
  is_oauth:boolean
  oauth_service_id:string|null
  uses_setting_value:boolean
}

export type ValidationResult = {
  is_valid: boolean
  setting_value:any
  // When `is_valid == true`
  res_data?: any
  // When `is_valid == false`
  error_message?: string
}

export type LoaderModuleOutput = {
  entries:any[]
  pagination_options:PaginationOptions
  service_response?:any
}

export type Entry = {
  service_id:string,
  id: any,
  title: string,
  content: string,
  datetime_info: string
  /**
   * Services like Reddit returns html content which can just
   * be pasted as is in the client
   */
  is_html_content?: boolean,
  contexts?: { name: string, url?: string, value?: string }[],
  resources?: {
    thumbnail_url?: string,
    main?: { type: "img", value: string }
  },
  // Helpful when debugging
  json_content?:any
}