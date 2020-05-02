import { SessionSocketEventHandler } from "~/src/server/gyst-server/ws-server-socket-handler-collection/socket-handler-base/session"
import { getEntriesInit } from "~/src/server/loader-module-method-collection/get-entries-init"

export class GystEntriesInitSocketHandler extends SessionSocketEventHandler {
  gyst_suite_id!:string|null

  handleImpl() {
    getEntriesInit(this.user_id!, async (data:any) => {
      this.socket.emit("gyst-entries-init-response", data)
    })
  }
}