export type WarningName = "NO_SETTING_VALUES" | "NO_SERVICE_SETTINGS" | "RATE_LIMIT" | "ALL_LOADED"

export type ErrorName =
  "INVALID_SETTING_VALUE" |
  /**
   * 2020-07-01 09:00
   * 
   * Token was marked as an error. So the user needs to reconnect the service or something to fix this.
   * Token isn't removed when an error occurs because that can be confusing for user. Instead, mark it as
   * an error. And when using the token, check if it is marked as an error or not.
   */
  "TOKEN_MARKED_ERROR" |
  "GOOGLE_AUTHORIZATION_ERROR" |
  "RIOT_KEY_EXPIRED" |
  "SETTING_VALUE_VALIDATION_ERROR" |
  "MUST_BE_ANON_USER" |
  "MUST_BE_LOGGED_IN" |
  "BAD_SIGNUP_FORM"

export type Warning = {
  name: WarningName
  message?: string
}

export type Error = {
  name: ErrorName
  message?: string
}