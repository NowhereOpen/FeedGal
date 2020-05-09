import { MatchPathFunc } from "~/src/server/gyst-server/server-side-data-injection-collection/base"
import { SessionServerSideDataInjection } from "~/src/server/gyst-server/server-side-data-injection-collection/base/session"

import { getServiceInfos } from "./get-service-infos"

import { getServiceSettingsForGystSuiteId } from "~/src/server/gyst-server/common/gyst-suite"

export class SettingsGystSuitesPageInjection extends SessionServerSideDataInjection {
  /**
   * Inject
   * 
   *   - gyst_suites
   */
  async loadData() {
    const service_settings = await getServiceSettingsForGystSuiteId(this.user_id!)
    const service_infos = await getServiceInfos(this.user_id!)

    this.data = {
      service_settings,
      service_setting_editor: {
        service_infos
      }
    }
  }
}

export const SettingsGystSuitesPageMatchPath:MatchPathFunc = (matched_path) => {
  return matched_path == "/suite"
}