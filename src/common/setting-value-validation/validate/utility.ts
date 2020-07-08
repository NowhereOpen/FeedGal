export function getInvalidReason<InvalidReason, SettingValue=any>(validate_fns:((arg:SettingValue) => InvalidReason|undefined)[], value:SettingValue) {
  let invalid_reason:InvalidReason|undefined
  validate_fns.some(fn => {
    invalid_reason = fn(value)
    return invalid_reason
  })
  return invalid_reason
}