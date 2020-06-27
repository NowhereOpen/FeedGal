import { ServiceSetting } from "~/src/common/types/common/gyst-suite"
import { ServiceInfo } from "~/src/common/types/common/service-info"

export * from "~/src/common/types/common/service-info"
export * from "~/src/common/types/common/gyst-suite"

export type ServiceSettings = ServiceSetting[]
export type ServiceInfos = ServiceInfo[]
export type State = {
  service_settings:ServiceSettings
  service_infos:ServiceInfos
}