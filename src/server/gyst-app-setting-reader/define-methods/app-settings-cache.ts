export function attach(TargetClass:any) {
  TargetClass.prototype.isCachingEntries = function():boolean {
    return this.getSettings(["dev", "is-caching-entries"])
  }

  TargetClass.prototype.usingCachedEntries = function():boolean {
    return this.getSettings(["dev", "using-cached-entries"])
  }

  TargetClass.prototype.getCacheOldAge = function():any {
    return this.getSettings(["dev", "cache-old-age"])
  }

  TargetClass.prototype.isUpdateOldCache = function():boolean {
    return this.getSettings(["dev", "update-old-cache"])
  }
}