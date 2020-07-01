import { Warning, WarningName, Error, ErrorName } from "~/src/common/types/common/warning-error"

export const GOOGLE_AUTHORIZATION_ERROR:Error = {
  name: "GOOGLE_AUTHORIZATION_ERROR",
  message: "Authorization to this service wasn't granted when you connected the account"
}

export const RIOT_API_ERROR:Error = {
  name: "RIOT_KEY_EXPIRED",
  message: "The server admin forgot to refresh the Riot API KEY 🤦.",
}