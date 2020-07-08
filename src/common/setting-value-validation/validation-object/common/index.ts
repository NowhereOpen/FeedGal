import { CommonInvalidReason } from "~/src/common/types/common/setting-value-validation"

export const SAME_VALUE = () => <CommonInvalidReason> {
  name: "SAME_VALUE",
  message: "Value is the same."
}

export const VALUE_EXISTS = () => <CommonInvalidReason> {
  name: "VALUE_EXISTS",
  message: "Value already exists."
}