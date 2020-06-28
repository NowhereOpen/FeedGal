export type ServerSideErrorName =
  "DEV_ERROR" |
  "INVALID_NEW_OAUTH_ACCOUNT" |
  "SETTING_VALUE_VALIDATION_ERROR" |
  "INVALID_GYST_LOGIN" |
  "MUST_BE_ANON_USER" |
  "MUST_BE_LOGGED_IN" |
  "DUPLICATE_LOGIN_METHOD" |
  "DISALLOWED_ACTION" |
  "OAUTH_CONNECTED_USER_NOT_EXIST" |
  "INVALID_NEW_GYST_LOGIN"

export type ServerSideError = {
  error: {
    name:ServerSideErrorName
    message:string
    data?:any
  }
}