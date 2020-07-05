import { getSuiteServiceSettingsForUserId } from "~/src/server/gyst-server/common/gyst-suite"

import { getServiceInfos } from "./get-service-infos"
import { validate } from "./validate"

// Types
import { State } from "~/src/common/types/pages/suite"

export async function inject(state:State, user_id:string) {
  await validate(user_id)
  state.suite_service_settings = await getSuiteServiceSettingsForUserId(user_id)
  state.editor_selectables = await getServiceInfos(user_id)
}