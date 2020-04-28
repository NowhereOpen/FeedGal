import { GystEntry } from "~/src/gyst/common/types/gyst-entry"

export function formatEntries(entry:any):GystEntry {
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