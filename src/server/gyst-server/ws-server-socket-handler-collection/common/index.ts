import { ErrorName, Error } from "~/src/common/types/common/warning-error"

export function commonErrorDetailGenerator(e:Error, known_errors:ErrorName[]=[]) {
  const is_known_error = known_errors.includes(e.name)
  let error_detail:Error
  if(is_known_error) {
    /**
     * 2020-03-21 22:39
     * `response.error = e` doesn't set `response.error.message`
     * when `e` is an error created with `new Error("Some message")`
     * for some reason. So have to assign each property individually.
     */
    error_detail = {
      name: <ErrorName> e.name,
      message: e.message,
    }
  }
  else {
    console.log(e)
    console.error(`[ERROR][commonErrorDetailGenerator] Make sure to throw a 'known error' so that it can be handled by this function.`)
    throw e
  }

  return error_detail
}