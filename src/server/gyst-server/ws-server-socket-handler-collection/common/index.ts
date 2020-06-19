import {
  GystEntryError,
  GystEntryResponseErrorDetails
} from "~/src/common/types/gyst-entry"

export function commonErrorDetailGenerator(e:Error, known_errors:GystEntryError[]=[]) {
  const is_known_error = ["DEV_FAULT_MSG", "DEV_FAULT", ...known_errors].includes(e.name)
  let error_detail:GystEntryResponseErrorDetails
  if(is_known_error) {
    if(e.name == "DEV_FAULT") {
      error_detail = {
        name: "DEV_FAULT",
        message: "The developer did something wrong.",
        data: {
          error: {
            name: e.name,
            message: e.message
          }
        }
      }
    }
    else {
      /**
       * 2020-03-21 22:39
       * `response.error = e` doesn't set `response.error.message`
       * when `e` is an error created with `new Error("Some message")`
       * for some reason. So have to assign each property individually.
       */
      error_detail = {
        name: <GystEntryError> e.name,
        message: e.message,
        // Can be undefined
        data: (<any> e).data
      }
    }
  }
  else {
    console.error(`[ERROR][commonErrorDtailGenerator] Make sure to throw a 'known error' so that it can be handled by this function.`)
    throw e
  }

  return error_detail
}