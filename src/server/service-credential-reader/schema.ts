import jsonschema from "jsonschema"

const oauth2_schema:any = {
  id: "/OAuth2Schema",
  type: "object",
  properties: {
    "client-id": { type: "string", required: true },
    "client-secret": { type: "string", required: true },
  }
}

const oauth1_schema:any = {
  id: "/OAuth1Schema",
  type: "object",
  properties: {
    "consumer-key": { type: "string", required: true },
    "consumer-secret": { type: "string", required: true },
  }
}

const api_schema:any = {
  id: "/ApiSchema",
  type: "object",
  properties: {
    "api-key": { type: "string", required: true }
  }
}

export const service_credentials_schema:any = {
  id: "/ServiceCredentialsSchema",
  type: "object",
  properties: {
    "service-credentials": {
      type: "object", required: true,
      additionalProperties: {
        type: "object",
        ormat: "oauthService"
      }
    }
  }
}

export function validate(object:any) {
  const validator = new jsonschema.Validator()

  validator.customFormats.oauthService = (input:any) => {
    if(["api-key", "oauth-type"].includes(input)) {
      // Can't have both api key and use oauth
      return false
    }

    if(! ["api-key", "oauth-type"].some(prop_name => prop_name in input)) {
      // The service entry MUST have one of these prop_name 
      return false
    }

    if("api-key" in input) {
      return validator.validate(input, api_schema).valid
    }

    if("oauth-type" in input) {
      const oauth_type = input["oauth-type"]
      if(oauth_type == "oauth1") {
        return validator.validate(input, oauth1_schema).valid
      }
      else if(oauth_type == "oauth2") {
        return validator.validate(input, oauth1_schema).valid
      }
    }

    return false
  }

  validator.customFormats.oauthType = (input:any) => {
    console.log("oauthType format called", input)
    return ["oauth1", "oauth2"].includes(input)
  }

  const result = validator.validate(object, service_credentials_schema)
  return result.valid
}