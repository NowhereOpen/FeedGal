import * as _ from "lodash"

import { StrictFileReader } from "~/src/server/lib/file-reader"

import { validate } from "./schema"

type oauth_type = "oauth1" | "oauth2"

interface IServiceCredentialReader {
  getServiceIds()                                 :string[]
  getEnabledOAuthServiceIds()                     :string[]
  getServiceIdsUsingOAuth()                       :string[]

  getOAuthType(service_id:string)                 :oauth_type
  getServiceName(service_id:string)               :string
  
  getClientId(service_id:string)                  :string
  getClientSecret(service_id:string)              :string
  getConsumerKey(service_id:string)               :string
  getConsumerSecret(service_id:string)            :string
  getApiKey(service_id:string)                    :string
  
  getExtra(service_id:string)                     :any
  getExtraProp(service_id:string, props:string[]) :any
}

export class ServiceCredentialReader extends StrictFileReader implements IServiceCredentialReader {
  service_credentials:any

  loadDone() {
    this.service_credentials = this.yaml_content["service-credentials"]
  }

  validate() {
    const result = validate(this.yaml_content)

    if(result == false) {
      throw Error("Validate failed for service credentials.")
    }
  }

  private getProp(service_id:string, prop:string) {
    if(! (service_id in this.service_credentials)) {
      console.error(`The passed service_id (${service_id}) doesn't exist in the file.`)
      throw Error(`The passed service id doesn't exist in the file.`)
    }
    validate
    const setting = this.service_credentials[service_id][prop]
    return setting
  }

  isOAuth(service_id:string) {
    return "oauth-type" in this.service_credentials[service_id]
  }

  getServiceIds():string[] {
    return Object.keys(this.service_credentials)
  }

  getEnabledServices():any[] {
    const services = Object.entries(this.service_credentials).filter(([service_id, _entry]) => {
      const entry = <any> _entry
      if("disabled" in entry && entry.disabled === true) return false

      return true
    }).map(([service_id, entry]) => entry)

    return services
  }

  /**
   * 2020-03-02 13:33
   * 
   * I don't think this is used?
   */
  getEnabledServiceIds():string[] {
    return this.getEnabledServices().map((entry) => entry["service-id"])
  }

  getEnabledOAuthServiceIds():string[] {
    const service_ids = this.getEnabledServices()
      .filter(service => "oauth-type" in service)
      .map((entry) => entry["service-id"])

    return service_ids
  }

  getServiceIdsUsingOAuth():string[] {
    return Object.keys(this.service_credentials).filter(service_id => this.isOAuth(service_id))
  }

  getOAuthType(service_id:string):oauth_type {
    return this.getProp(service_id, "oauth-type")
  }

  getServiceName(service_id:string):string {
    return this.getProp(service_id, "service-name")
  }

  getClientId(service_id:string):string {
    return this.getProp(service_id, "client-id")
  }

  getClientSecret(service_id:string):string {
    return this.getProp(service_id, "client-secret")
  }

  getConsumerKey(service_id:string):string {
    return this.getProp(service_id, "consumer-key")
  }

  getConsumerSecret(service_id:string):string {
    return this.getProp(service_id, "consumer-secret")
  }

  getApiKey(service_id:string):string {
    return this.getProp(service_id, "api-key")
  }

  getExtra(service_id:string):any {
    return this.getProp(service_id, "extra")
  }

  getExtraProp(service_id:string, props:string[]):any {
    return _.get(this.getProp(service_id, "extra"), props)
  }
}

export let service_credentials_reader:ServiceCredentialReader

export function setup(file_path:string) {
  service_credentials_reader = new ServiceCredentialReader(file_path)
  service_credentials_reader.load()

  return service_credentials_reader
}