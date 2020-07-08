import { LeagueOfLegendsInvalidReason } from "~/src/common/types/common/setting-value-validation"

export const SUMMONER_NAME_EMPTY = () => <LeagueOfLegendsInvalidReason> {
  name: "SUMMONER_NAME_EMPTY",
  message: "Please provide a summoner name."
}

export const REGION_EMPTY = () => <LeagueOfLegendsInvalidReason> {
  name: "REGION_EMPTY",
  message: "Please choose a region."
}

export const ALL_EMPTY = () => <LeagueOfLegendsInvalidReason> {
  name: "ALL_EMPTY",
  message: "Please choose a region and provide a summoner name."
}

export const SUMMONER_NOT_FOUND = () => <LeagueOfLegendsInvalidReason> {
  name: "SUMMONER_NOT_FOUND",
  message: "Summoner name was not found"
}