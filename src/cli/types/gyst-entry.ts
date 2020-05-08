/**
 * 2020-03-19 15:51
 * 
 * Different GystEntry type from `/src/gyst/common/types/gyst-entry`.
 * 
 * This data structure is constructed on client side.
 */

import { GystEntry } from "~/src/common/types/gyst-entry"

export type GystEntryWrapper = {
  pagination_index:number
  gyst_entry:GystEntry
}