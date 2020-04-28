import { GetServiceResponse } from "~/src/gyst/server/base-class/service-module/get-service-response"
import { getMemberAction } from "~/src/lib/gyst-entries-helper/services/trello"

export class GetTrelloServiceResponse extends GetServiceResponse {
  async run() {
    const trello_cred = this.credential

    let pagination_param = undefined
    const direction = this.pagination_direction
    const value = this.pagination_value
    if(direction == "old") {
      pagination_param = { before: value }
    }
    else if(direction == "new") {
      pagination_param = { since: value }
    }

    const data = await getMemberAction(trello_cred, pagination_param)
    return data
  }
}