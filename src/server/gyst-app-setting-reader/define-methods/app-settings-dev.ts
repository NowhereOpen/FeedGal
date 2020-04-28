export function attach(TargetClass:any) {
  TargetClass.prototype.isDevPathEnabled = function():boolean {
    return this.getSettings(["dev", "dev-path-enabled"])
  }

  TargetClass.prototype.getForceLoginEntryId = function():string {
    return this.getSettings(["dev", "force-login-as"])
  }

  TargetClass.prototype.isAllowForceLogin = function():boolean {
    return this.getSettings(["dev", "allow-force-login"])
  }

  TargetClass.prototype.isAllowAuthenticatedHttpRequest = function():boolean {
    return this.getSettings(["dev", "allow-authenticated-http-request"])
  }
}