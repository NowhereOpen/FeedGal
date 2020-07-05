import { GetEntriesBaseSocketHandler } from "../../socket-handler-base/get-entries-base"

// Methods
import { getEntriesInit, iterateSuiteEntries } from "~/src/server/method-collection"

// Types
import { EntriesResult } from "~/src/server/method-collection/common/services/base/types"
import { SuiteEntry } from "~/src/server/method-collection"

export class GystEntriesInitSocketHandler extends GetEntriesBaseSocketHandler {
  constructor() {
    super("gyst-entries-init")
  }

  async getIterable() {
    const parameters:SuiteEntry[] = await getSuiteEntries(this.user_id!)
    return parameters
  }

  async getEntriesResult(param:SuiteEntry) {
    const entries_result:EntriesResult = await getEntriesInit(param)
    return entries_result
  }
}

async function getSuiteEntries(user_id:string) {
  const suite_entries:SuiteEntry[] = []
  await iterateSuiteEntries(user_id, async ({ service_info, suite_entry }) => {
    suite_entries.push(suite_entry)
  })
  return suite_entries
}