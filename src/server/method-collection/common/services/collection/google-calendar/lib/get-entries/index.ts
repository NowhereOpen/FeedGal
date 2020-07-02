import moment from "moment"

import { EntriesResult, PaginationData, Entry } from "../../../../base/types"
import { _getEventsWithinRange } from "~/src/server/lib/loader-module-helpers/services/google-calendar"

type DateRange = { from: any, to: any }

export async function getEntries(access_token:string, calendar_id:string, date_range:DateRange):Promise<EntriesResult> {
  const entries:any[] = await _getEventsWithinRange(access_token, date_range, calendar_id)
  return {
    entries: entries.map(formatEntries),
    pagination_data: getPaginationData(date_range),
    service_response: entries
  }
}

function formatEntries(entry:any):Entry {
  return {
    service_id: "google-calendar",
    id: entry.id,
    title: entry.summary,
    content: entry.description,
    is_html_content: true,
    json_content: entry,
    datetime_info: "date" in entry.start ? entry.start.date : entry.start.dateTime,
    contexts: [
      { name: "Google Calendar", url: "https://calendar.google.com" },
      { name: "Event", url: entry.htmlLink }
    ],
  }
}

function getPaginationData(date_range?:DateRange):PaginationData {
  if(date_range == null) {
    date_range = {
      from: moment().startOf("week"),
      to: moment().endOf("week"),
    }
  }
  else {
    date_range = {
      from: moment(date_range.from),
      to: moment(date_range.to)
    }
  }

  return {
    new: {
      from: date_range.from.clone().add(7, "days").toString(),
      to: date_range.to.clone().add(7, "days").toString(),
    },
    old: {
      from: date_range.from.clone().subtract(7, "days").toString(),
      to: date_range.to.clone().subtract(7, "days").toString(),
    }
  }
}