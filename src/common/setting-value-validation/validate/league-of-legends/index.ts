import { LeagueOfLegendsInvalidReason } from "~/src/common/types/common/setting-value-validation"
import { LeagueOfLegendsSettingValue } from "~/src/common/types/common/setting-value"
import { ALL_EMPTY, REGION_EMPTY, SUMMONER_NAME_EMPTY } from "../../validation-object/league-of-legends"
import { getInvalidReason } from "../utility"

export function validateAllNotEmpty(value:LeagueOfLegendsSettingValue):LeagueOfLegendsInvalidReason|undefined {
  if(validateRegionNotEmpty(value) != null && validateSummonerNameNotEmpty(value) != null) {
    return ALL_EMPTY()
  }
}

export function validateRegionNotEmpty(value:LeagueOfLegendsSettingValue):LeagueOfLegendsInvalidReason|undefined {
  if(value.region.trim() == "") {
    return REGION_EMPTY()
  }
}

export function validateSummonerNameNotEmpty(value:LeagueOfLegendsSettingValue):LeagueOfLegendsInvalidReason|undefined {
  if(value.summoner_name.trim() == "") {
    return SUMMONER_NAME_EMPTY()
  }
}

export function validate(new_value:LeagueOfLegendsSettingValue):LeagueOfLegendsInvalidReason|undefined {
  let invalid_reason = getInvalidReason<LeagueOfLegendsInvalidReason, LeagueOfLegendsSettingValue>([validateAllNotEmpty, validateRegionNotEmpty, validateSummonerNameNotEmpty], new_value)
  return invalid_reason
}