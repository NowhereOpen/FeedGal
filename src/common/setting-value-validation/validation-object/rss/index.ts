import { RssInvalidReason } from "~/src/common/types/common/setting-value-validation"

export const TEST_REQUEST_ERROR = () => <RssInvalidReason> {
  name: "TEST_REQUEST_ERROR",
  message: "Tested getting RSS feeds but failed with an error."
}

export const INVALID_URL = () => <RssInvalidReason> {
  name: "INVALID_URL",
  message: "Bad URL. Did you include 'https://'?"
}