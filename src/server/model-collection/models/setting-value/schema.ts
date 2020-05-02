import mongoose from "mongoose"

export const schema = {
  // user_id associated with service_setting_id
  service_setting_id:{ type: String, required: true },
  is_invalid: { type: Boolean, required: true, default: false },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
}