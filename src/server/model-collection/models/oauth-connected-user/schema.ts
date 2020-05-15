export const schema = {
  // gyst_user_id
  user_id: String,
  
  service_id: String,
  service_user_uid: String,
  
  // Identifiable info like nicknames and login/user name.
  friendly_name: String,
  service_user_id: String,

  connected_at: { type: Date, default: () => new Date() },
  is_signup: { type: Boolean, default: false },
  error_with_access_token: { type: Boolean, default: false },
  
  /**
   * 2020-05-14 16:17
   * 
   * REQUIRED. Eg, Github requires `username` to make request and storing the
   * information on DB would be VERY helpful.
   * 
   * 2019-12-03 10:58 Just because
   */
  user_info: Object
}