export type ServerSideErrorName =
  "DEV_ERROR" |
  "SETTING_VALUE_VALIDATION_ERROR" |
  "MUST_BE_ANON_USER" |
  "MUST_BE_LOGGED_IN"

export type ServerSideError = {
  error: {
    name:ServerSideErrorName
    message:string
    data?:any
  }
}