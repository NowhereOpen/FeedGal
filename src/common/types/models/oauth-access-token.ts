type OAuth1Tokens = {
  token:string
  token_secret:string
  retrieved_at:string
}

export type OAuthAccessToken = {
  _id:string
  service_id:string
  oauth_connected_user_entry_id:string
  data:any,
  retrieved_at:Date,
  invalid_at:Date,
  refreshed_at:Date,
  oauth1_tokens:OAuth1Tokens
}