import { getServiceSettingsForGystSuiteId } from "~/src/server/gyst-server/common/gyst-suite"

import { getServiceInfos } from "../../common/get-service-infos"
import { validate } from "./validate"

export async function inject(state:any, user_id:string) {
  await validate(user_id)
  state.service_settings = await getServiceSettingsForGystSuiteId(user_id)
  state.service_infos = await getServiceInfos(user_id)
}