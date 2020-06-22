export function attach(TargetClass:any) {
  TargetClass.prototype.getExternalHost = function():string {
    let value = this.getSettings(["server", "ext-host"], "localhost")
    return value
  }

  TargetClass.prototype.getProtocol = function():"http"|"https" {
    let value = this.getSettings(["server", "protocol"], "http")
    return value
  }

  TargetClass.prototype.getPort = function():number {
    if("PORT" in process.env) {
      return Number(process.env.PORT)
    }
    const file_port = this.getSettings(["server", "port"], 3000)
    return Number(file_port)
  }

  TargetClass.prototype.getPrivateKeyPath = function():string {
    return this.getSettings(["server", "private-key-path"])
  }

  TargetClass.prototype.getCertificatePath = function():string {
    return this.getSettings(["server", "certificate-path"])
  }

  TargetClass.prototype.getDBName = function():string {
    return this.getSettings(["server", "db-name"])
  }
  
  TargetClass.prototype.getDBTestName = function():string {
    return this.getSettings(["server", "db-test-name"])
  }

  TargetClass.prototype.getSessionSecret = function():string {
    return this.getSettings(["server", "session-secret"])
  }
}