import fs from "fs"
import moment from "moment"
import jsonschema from "jsonschema"

const server_schema:any = {
  id: "/ServerSchema",
  type: "object",
  properties: {
    "ext-host": { type: "string", required: true },
    "protocol": { type: "string", required: true },
    "private-key-path": { type: "string", format: "filePathExists", required: true },
    "certificate-path": { type: "string", format: "filePathExists", required: true }
  }
}

const dev_schema:any = {
  id: "/DevSchema",
  type: "object",
  properties: {
    "dev-path-enabled": { type: "boolean", required: true },
    "force-login-as": {  },
    "allow-force-login": { type: "boolean", required: true },
    "allow-authenticated-http-request": { type: "boolean", required: true },
  }
}

const cache_schema:any = {
  id: "/CacheSchema",
  type: "object",
  properties: {
    "is-caching-entries": { type: "boolean", required: true },
    "using-cached-entries": { type: "boolean", required: true },
    "cache-old-age": { type: "object", format: "momentDuration", required: true},
    "update-old-cache": { type: "boolean", required: true },
  }
}

export const app_settings_schema:any = {
  id: "/AppSettingsSchema",
  type: "object",
  properties: {
    "gyst": {
      "type": "object",
      properties: {
        "server": { type: "object", required: true, $ref: "/ServerSchema" },
        "dev": { type: "object", required: true, $ref: "/DevSchema" },
        "cache": { type: "object", required: true, $ref: "/CacheSchema" }
      }
    }
  }
}

export function validate(object:any) {
  const validator = new jsonschema.Validator()

  validator.customFormats.momentDuration = (input:any) => {
    const duration = moment.duration(input)
    return duration.as("milliseconds") != 0
  }
  
  validator.customFormats.filePathExists = (input:any) => {
    return fs.existsSync(input)
  }

  validator.addSchema(server_schema)
  validator.addSchema(dev_schema)
  validator.addSchema(cache_schema)

  return validator.validate(object, app_settings_schema).valid
}