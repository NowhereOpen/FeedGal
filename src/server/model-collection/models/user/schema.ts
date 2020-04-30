import { Schema } from "mongoose"

export const schema = {
  friendly_name: { type: String, required: true },
  created_at: Date,
}