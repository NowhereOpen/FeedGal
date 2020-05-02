import { Int32 } from "bson"

export const schema = {
  user_id:{ type: String, required: true },
  
  // NOT `oauth_sid` for obvious reason; eg, riot doesn't use oauth2 but needs a setting.
  service_id: { type: String, required: true },
  
  oauth_connected_user_entry_id:{ type: String, required: false },
  
  // Use bson Int32(0) for false and Int32(1) for true
  is_disabled: { type: Number, required: true, default: new Int32(0) },
}