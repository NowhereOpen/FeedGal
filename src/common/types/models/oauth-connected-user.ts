export type OAuthConnectedUser = {
  _id:string
  user_id: string
  service_id: string
  service_user_uid: string
  friendly_name: string
  service_user_id: string
  connected_at: Date
  is_signup: boolean
  error_with_access_token: boolean
  user_info: any
}