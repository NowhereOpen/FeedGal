import fs from "fs"

import { setup as setupGystAppSettingReader } from "~/src/server/gyst-app-setting-reader"
import { setup as setupServiceCredentialReader } from "~/src/server/service-credential-reader"
import { setup as setupMongoose } from "~/src/server/mongoose"
import { setup as setupLoaderModuleCollection } from "~/src/server/loader-module-collection"
import { setup as setupServiceInfoCollection } from "~/src/server/loader-module-collection/service-info-collection"
import { setup as setupCredModuleCollection } from "~/src/server/cred-module-collection"
import { setup as setupModelCollection } from "~/src/server/model-collection"
import { runServer, ServerSettings } from "~/src/server/gyst-server"

const GYST_APP_SETTING_FP = "./app-settings.yml"
const SERVICE_CREDENTIALS_FP = "./service-credentials.yml"
const ROOT_TO_NUXT_CONFIG_FP = "./nuxt.config.js"

function start() {
  const app_settings = setupGystAppSettingReader(GYST_APP_SETTING_FP)
  setupServiceCredentialReader(SERVICE_CREDENTIALS_FP)

  const db_name = app_settings.getDBName()
  setupMongoose(db_name)
  setupCredModuleCollection()
  setupLoaderModuleCollection()
  setupServiceInfoCollection()
  setupModelCollection()

  const protocol = app_settings.getProtocol()
  const session_secret = app_settings.getSessionSecret()

  const service_setting:ServerSettings = { protocol, session_secret }
  if(protocol == "https") {
    const private_key_path = app_settings.getPrivateKeyPath()
    const certificate_path = app_settings.getCertificatePath()
    const key = fs.readFileSync(private_key_path, "utf-8")
    const cert = fs.readFileSync(certificate_path, "utf-8")
    service_setting.https_creds = { key, cert }
  }
  
  runServer(service_setting, ROOT_TO_NUXT_CONFIG_FP)
}

start()


// import express from "express"
// import consola from "consola"
// /**
//  * 2020-02-06 07:09
//  * 
//  * Throws an error when used with `import ... from "nuxt"`, and there is no
//  * `@types/nuxt` module when I try to install it.
//  * 
//  * The `require` method works, however.
//  */
// const { Nuxt, Builder } = require("nuxt")

// const app = express()

// // Import and Set Nuxt.js options
// const config = require('../nuxt.config.js')
// config.dev = process.env.NODE_ENV !== 'production'

// async function start () {
//   // Init Nuxt.js
//   const nuxt = new Nuxt(config)

//   const { host, port } = nuxt.options.server

//   // Build only in dev mode
//   if (config.dev) {
//     const builder = new Builder(nuxt)
//     await builder.build()
//   } else {
//     await nuxt.ready()
//   }

//   // Give nuxt middleware to express
//   app.use(nuxt.render)

//   // Listen the server
//   app.listen(port, host)
//   consola.ready({
//     message: `Server listening on http://${host}:${port}`,
//     badge: true
//   })
// }
// start()
