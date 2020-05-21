import { getServiceInfos } from "./get-service-infos"
import { getServiceSettingsForGystSuiteId } from "~/src/server/gyst-server/common/gyst-suite"

export async function inject(state:any, user_id:string) {
  state.service_settings = await getServiceInfos(user_id)
  state.service_setting_editor.service_infos = await getServiceSettingsForGystSuiteId(user_id)
}