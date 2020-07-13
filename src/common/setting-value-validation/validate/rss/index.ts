import { RssInvalidReason } from "~/src/common/types/common/setting-value-validation"
import { RssSettingValue } from "~/src/common/types/common/setting-value"
import { INVALID_URL } from "../../validation-object/rss"

export function validateValidUrl(value:RssSettingValue):RssInvalidReason|undefined {
  try {
    new URL(value.url)
    return
  }
  catch(e) {
    if(e.code == "ERR_INVALID_URL") {
      return INVALID_URL()
    }
  }
}