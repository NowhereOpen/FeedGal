import { getServiceInfos } from "../../common/get-service-infos"
import { getServiceSettingsForGystSuiteId } from "~/src/server/gyst-server/common/gyst-suite"

export async function inject(state:any, user_id:string) {
  state.service_settings = await getServiceSettingsForGystSuiteId(user_id)
  state.service_infos = await getServiceInfos(user_id)
}