import * as _ from "lodash"
import { StrictFileReader } from "~/src/server/lib/file-reader"
import { validate, app_settings_schema } from "./schema"

export class AppSettingsReader extends StrictFileReader {
  app_settings!:any
  
  loadDone() {
    this.app_settings = this.yaml_content["gyst"]
  }

  validate() {
    validate(this.yaml_content)
  }

  notImplemented() {
    throw Error("Not implemented")
  }

  /**
   * Used by `define-methods` modules
   */
  getSettings(path:string[], default_value?:any) {
    let value = _.get(this.app_settings, path)
    /**
     * Genius lodash treats null and undefined differently
     */
    if([undefined, null].includes(value)) {
      value = default_value
    }
    return value
  }

  // Server
  getExternalHost():string { return <any> this.notImplemented() }
  getProtocol():"http"|"https" { return <any> this.notImplemented() }
  getPrivateKeyPath():string { return <any> this.notImplemented() }
  getCertificatePath():string { return <any> this.notImplemented() }
  getDBName():string { return <any> this.notImplemented() }
  getDBTestName():string { return <any> this.notImplemented() }
  getSessionSecret():string { return <any> this.notImplemented() }

  // Dev
  isDevPathEnabled():boolean { return <any> this.notImplemented() }
  getForceLoginEntryId():string { return <any> this.notImplemented() }
  isAllowForceLogin():boolean { return <any> this.notImplemented() }
  isAllowAuthenticatedHttpRequest():boolean { return <any> this.notImplemented() }

  // Cache
  isCachingEntries():boolean { return <any> this.notImplemented() }
  usingCachedEntries():boolean { return <any> this.notImplemented() }
  getCacheOldAge():any { return <any> this.notImplemented() }
  isUpdateOldCache():boolean { return <any> this.notImplemented() }
}

import { attach as attachCache } from "./define-methods/app-settings-cache"
import { attach as attachDev } from "./define-methods/app-settings-dev"
import { attach as attachServer } from "./define-methods/app-settings-server"

export let app_settings_reader:AppSettingsReader

export function setup(file_path:string) {
  attachCache(AppSettingsReader)
  attachDev(AppSettingsReader)
  attachServer(AppSettingsReader)

  app_settings_reader = new AppSettingsReader(file_path)
  app_settings_reader.load()

  return app_settings_reader
}