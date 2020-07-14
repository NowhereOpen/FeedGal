import _ from "lodash"

import { gystEntriesFromResponse } from "~/src/cli/store/loader"

// Types
import {
  GystEntryResponseSuccess
} from "~/src/common/types/pages/main"
import { GystEntryWrapper } from "~/src/common/types/pages/main"

const DB_NAME = "feedgal"
const OBJECT_STORE_NAME = "rss-feeds"

export async function storeFeeds(response:GystEntryResponseSuccess):Promise<void> {
  const entries = gystEntriesFromResponse(response)
  const db = await initObjectStore()

  let entries_length = entries.length
  /**
   * 2020-07-14 13:52
   * 
   * Need to add entries that are possibly in `new -> old` order in the reverse order
   * so that the next entries (in response B) to be added next to the previous entries
   * (in response A) stored continue as:
   * 
   * ```
   * [old ... response A ... new] [old ... response B ... new]
   * ```
   * 
   * So, the operation needs to be in REVERSE AND SYNC.
   */
  while(entries_length--) {
    const entry = entries[entries_length]
    try {
      await new Promise(async (res, rej) => {
        const ost = db.transaction(OBJECT_STORE_NAME, "readwrite").objectStore(OBJECT_STORE_NAME)
        // Refer to the `index` of the object store
        const new_entry = { id: entry.entry.id, entry: <GystEntryWrapper>entry }
        const request:IDBRequest = ost.add(new_entry)
        request.onsuccess = ({ target }) => {
          const key_path = (<IDBRequest> target).result
          res()
        }
        request.onerror = (event:any) => {
          rej(event)
        }
      })
    }
    catch(e) {
      const error = _.get(e, "target.error")
      if(error) {
        const code = error.code
        if(code == 0) {
          // ConstraintError
        }
        else if(code == 20) {
          // AbortError
          /**
           * 2020-07-11 19:38
           * 
           * Some error occurred ahead of this request, and the rest of the actions that
           * use the same transaction will run in to this error.
           * 
           * Reproducing the error. Instead of creating a transaction for each entry,
           * create one transaction and try to add all entries with it. When one of them
           * throws an error (whose code isn't 20) will throw this error.
           */
        }
        else {
          /**
           * 2020-07-14 17:19
           * 
           * Do nothing in the cases above
           */
          throw e
        }

        continue
      }

      throw e
    }
  }
}

export type Record = { key: any, entry: GystEntryWrapper }

const MAX_OLDER_FEEDS__COUNT = 10
export async function getOlderFeeds(ind:number|null, isOlderFeed:(cursor:IDBCursorWithValue) => boolean):Promise<Record[]> {
  const db = await initObjectStore()
  const ost = db.transaction(OBJECT_STORE_NAME).objectStore(OBJECT_STORE_NAME)
  const result:Record[] = []

  let cursor_request:IDBRequest
  if(ind == null) {
    cursor_request = ost.openCursor(ind, "prev")
  }
  else {
    cursor_request = ost.openCursor(IDBKeyRange.upperBound(ind, true), "prev")
  }
  
  await new Promise((res, rej) => {
    cursor_request.onsuccess = () => {
      const cursor:IDBCursorWithValue = cursor_request.result
      if(cursor == undefined || result.length >= MAX_OLDER_FEEDS__COUNT) {
        res(result)
        return
      }

      const is_older_feed = isOlderFeed(cursor)
      if(is_older_feed) {
        result.push({ entry: cursor.value.entry, key: cursor.primaryKey })
      }
      cursor.continue();
    }
  })
  return result
}

async function initObjectStore():Promise<IDBDatabase> {
  return await new Promise((res, rej) => {
    Object.assign(
      indexedDB.open(DB_NAME, 1),
      {
        onupgradeneeded: (event:Event) => {
          const db = (<IDBOpenDBRequest> event.target!).result
          /**
           * 2020-07-12 09:57
           * 
           * Apparently, entries are sorted by the `keyPath` when being inserted. Tested with
           * `getAll` and cursor.
           */
          const rss_feeds = db.createObjectStore(OBJECT_STORE_NAME, { autoIncrement: true })
          rss_feeds.createIndex("byId", ["id"], { unique: true })
        },
        onsuccess: (event:Event) => {
          const db = (<IDBOpenDBRequest> event.target!).result
          res(db)
        },
        onerror: (error:any) => {
          rej(error)
        }
      }
    )
  })
}

function wrap(req:IDBRequest):Promise<any> {
  return new Promise((res, rej) => {
    req.onsuccess = (event) => res((<IDBRequest>event.target).result )
    req.onerror = (event) => rej(event.target)
  })
}