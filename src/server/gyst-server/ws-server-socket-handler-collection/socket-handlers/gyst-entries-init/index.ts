import { GetEntriesBaseSocketHandler } from "../../socket-handler-base/get-entries-base"
import { FlattenedLoaderParam, flattenServiceSettings, getEntriesInit } from "~/src/server/method-collection/get-entries-init"

// Types
import { EntriesResult } from "~/src/server/method-collection/common/services/base/types"

export class GystEntriesInitSocketHandler extends GetEntriesBaseSocketHandler {
  constructor() {
    super("gyst-entries-init")
  }

  async getIterable() {
    const parameters:FlattenedLoaderParam[] = await flattenServiceSettings(this.user_id!)
    return parameters
  }

  async getEntriesResult(param:FlattenedLoaderParam) {
    const entries_result:EntriesResult = await getEntriesInit(param)
    return entries_result
  }
}