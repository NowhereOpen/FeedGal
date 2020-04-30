export const schema = {
  service_id:String,
  oauth_connected_user_entry_id:String,

  data:Object,
  
  retrieved_at:Date,
  invalid_at:Date,
  refreshed_at:Date,

  // Only for oauth1. These are not access_tokens. Refer to note above.
  oauth1_tokens:{
    token:String,
    token_secret:String,
    retrieved_at:String
  }
}