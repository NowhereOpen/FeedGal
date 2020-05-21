import { MatchPathFunc } from "~/src/gyst/server/base-class/server-side-data-injection"
import { SessionServerSideDataInjection } from "~/src/gyst/server/base-class/server-side-data-injection/session"

import { gyst_suite_default_storage } from "~/src/server/model-collection/models/gyst-suite-default"

import { getGystSuites, getServiceSettingsForGystSuiteId } from "~/src/common-request-handling-tasks/gyst-suite"

import { GystSuite } from "~/src/gyst/common/types/gyst-suite"
import { LoaderController, ServiceSetting, SettingValue } from "~/src/gyst/common/types/loader-controller"

export class MainPageInjection extends SessionServerSideDataInjection {
  default_gyst_suite_id!:string|null

  async loadData() {
    this.default_gyst_suite_id = await gyst_suite_default_storage.getDefaultGystSuiteId(this.user_id!)
    
    this.data.gyst_suites = await this.getGystSuites()

    if(this.default_gyst_suite_id != null) {
      this.data.service_settings = await getServiceSettingsForGystSuiteId(this.default_gyst_suite_id)
      this.data.loader_controller = await getLoaderController(this.default_gyst_suite_id)
    }
  }

  async getGystSuites():Promise<GystSuite[]> {
    let gyst_suites:GystSuite[] = []

    if(this.default_gyst_suite_id == null) {
      gyst_suites = []
    }
    else {
      gyst_suites = await getGystSuites(this.user_id!, this.default_gyst_suite_id)
    }

    return gyst_suites
  }
}

export const MainPageMatchPath:MatchPathFunc = (matched_path) => {
  return matched_path == ""
}

async function getLoaderController(gyst_suite_id:string):Promise<LoaderController> {
  const service_settings = await getServiceSettingsForGystSuiteId(gyst_suite_id)

  const loader_controller:LoaderController = []

  service_settings.forEach(service_setting => {
    const loader_controller_entry:ServiceSetting = {
      service_id: service_setting.service_id,
      service_name: service_setting.service_name,
      service_setting_id: service_setting._id,
      // service_setting_name:string
      setting_values: [],
      uses_setting_value: service_setting.uses_setting_value,
      is_disabled: service_setting.is_disabled,
      is_oauth: service_setting.is_oauth,

      total_loaded: 0,
      is_loading:true,
      is_error:false,
      error: null,
      pagination_index: null,
      pagination_data: null
    }

    if(service_setting.is_oauth) {
      loader_controller_entry.oauth = {
        is_connected: service_setting.oauth_info!.is_connected
      }
    }

    if(service_setting.uses_setting_value) {
      const setting_values:SettingValue[] = []
      service_setting.setting_values.forEach(entry => {
        const setting_value:SettingValue = {
          setting_value_id: entry._id,
          value: entry.value,
          is_invalid: entry.is_invalid,

          is_loading:true,
          is_error:false,
          error: null,
          total_loaded: 0,
          pagination_index: null,
          pagination_data: null,
        }

        setting_values.push(setting_value)
      })

      loader_controller_entry.setting_values = setting_values
    }

    loader_controller.push(loader_controller_entry)
  })

  return loader_controller
}