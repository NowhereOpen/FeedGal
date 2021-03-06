import { EntriesResult, Entry } from "../../../../base/types"
import { getActions, getMemberAction, TrelloCred } from "~/src/server/lib/loader-module-helpers/services/trello"
import { ALL_LOADED } from "~/src/common/warning-error"

export async function getEntries(trello_cred:TrelloCred, pagination_param?:any):Promise<EntriesResult> {
  const data = await getMemberAction(trello_cred, pagination_param)
  let pagination_data = { new: undefined, old: undefined } 

  if(data.length == 0) {
    return {
      entries: [], pagination_data, warning: ALL_LOADED()
    }
  }

  // const data = await getActions(trello_cred, "5e5fa366328e540e26c067aa", pagination_param)
  pagination_data = getPaginationOption(data)

  const entries = data.map(formatEntries)
  const output = {
    entries,
    pagination_data,
    service_response: data
  }

  return output
}

function formatEntries(action:any):Entry {
  let text:string = action.entities.map((a:any) => a.text).reduce((a:any,b:any) => a + " " + b)
  let data = action.data
  let sortable_datetime = action.date
  let board_link, card_link
  // Handy flag to be used in modifying 'text' variable.
  let board_link_exists, card_link_exists

  let base_url = "https://www.trello.com"
  const contexts = [
    { name: "Trello", url: base_url }
  ]
  if(data.board) {
    board_link = `${base_url}/b/${data.board.shortLink}`
    board_link_exists = true
    contexts.push({ name: "Board", url: board_link })
  }
  if(data.card) {
    card_link = `${base_url}/c/${data.card.shortLink}`
    card_link_exists = true
    contexts.push({ name: "Card", url: card_link })
    // 2019-10-01 12:40 There is also `#comment` but both work interchangeably.
    contexts.push({ name: "Action", url: card_link + "#action-" + action.id })
  }

  /**
   * modifies `text` variable.
   */
  let content = text
  if(board_link_exists || card_link_exists) {
    content += `\n\n`

    if(board_link_exists) {
      content += `Board: ${board_link}`
    }

    if(board_link_exists && card_link_exists) {
      content += `\n`
    }

    if(card_link_exists) {
      content += `\nCard: ${card_link}`
    }
  }

  const TITLE_LENGTH = 70
  return {
    service_id: "trello",
    id: action.id,
    title: text.length > TITLE_LENGTH ? text.slice(0, TITLE_LENGTH).padEnd(TITLE_LENGTH + 3, ".") : text,
    content: content,
    datetime_info: sortable_datetime,
    contexts,
    json_content: action,
  }
}

function getPaginationOption(service_response:any) {
  const entries = service_response
  return {
    old: entries.slice(-1)[0].id,
    new: entries[0].id
  }
}