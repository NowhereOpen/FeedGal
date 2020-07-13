export type InvalidReasonTemplate<T> = {
  name: T,
  message: string,
  data?: any
}

export type InvalidReason = InvalidReasonTemplate<any>

export type GithubInvalidReasonName =  "ALL_EMPTY" | "REPO_NAME_EMPTY" | "OWNER_NAME_EMPTY" | "REPOSITORY_NOT_FOUND" | "EXACT_REPO_NAME_REQUIRED"
export type GithubInvalidReason = InvalidReasonTemplate<GithubInvalidReasonName>

export type GoogleCalendarInvalidReasonName = "NO_CALENDAR" | "CALENDAR_NOT_FOUND"
export type GoogleCalendarInvalidReason = InvalidReasonTemplate<GoogleCalendarInvalidReasonName>

export type LeagueOfLegendsInvalidReasonName = "SUMMONER_NAME_EMPTY" | "REGION_EMPTY" | "ALL_EMPTY" | "SUMMONER_NOT_FOUND"
export type LeagueOfLegendsInvalidReason = InvalidReasonTemplate<LeagueOfLegendsInvalidReasonName>

export type RssInvalidReasonName = "TEST_REQUEST_ERROR" | "INVALID_URL"
export type RssInvalidReason = InvalidReasonTemplate<RssInvalidReasonName>

export type CommonInvalidReasonName = "SAME_VALUE" | "VALUE_EXISTS"
export type CommonInvalidReason = InvalidReasonTemplate<CommonInvalidReasonName>