import { getServiceSettingsForGystSuiteId } from "~/src/server/gyst-server/common/gyst-suite"

// Types
import { ClientSideField, LoadStatus, LoadStatusServiceSetting } from "~/src/common/types/loader"
import { GystEntryWarning } from "~/src/common/types/gyst-entry"
import { State } from "~/src/common/types/pages/main"

export async function inject(state:State, user_id:string) {
  const load_status = await getServiceSettingsForGystSuiteId(user_id)
  load_status.forEach(_service_setting => {
    const service_setting:LoadStatusServiceSetting = <any> _service_setting
    Object.assign(service_setting, <ClientSideField> {
      is_loading: false,
      total: 0
    })

    if(service_setting.is_disabled) {
      service_setting.warning = <GystEntryWarning> {
        name: "DISABLED",
        data: null,
        message: "The service setting is disabled"
      }
    }

    if(service_setting.uses_setting_value) {
      service_setting.setting_values.forEach(setting_value => {
        Object.assign(setting_value, <ClientSideField> {
          is_loading: false,
          total: 0
        })
      })
    }
  })
  state.load_status = load_status
}