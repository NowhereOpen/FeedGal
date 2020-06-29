export type ServiceSetting = {
  _id:string
  user_id:string
  service_id: string
  oauth_connected_user_entry_id:string
  // Use bson Int32(0) for false and Int32(1) for true
  is_disabled: number|boolean
}