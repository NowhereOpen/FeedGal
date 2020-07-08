import { Socket } from "socket.io"

export abstract class SocketEventHandler {
  req!:any
  ack!:Function
  socket!:Socket
  session!:any

  constructor() {}

  onReceiveRequest():Promise<void>|void {}
  abstract handleImpl():any

  async handle(req:any, ack:Function, socket:Socket) {
    this.req = req
    this.ack = ack
    this.socket = socket
    this.session = this.socket.handshake.session!

    this.onReceiveRequest()

    /**
     * Note that response sent with `ack` is received by the client then is closed unless
     * another request is sent.
     * 
     * Use `this.socket.emit(event_name)` to send data that client just listens to.
     */
    await this.handleImpl()

    this.session.save((err:any) => {
      if(err) {
        throw err
      }
    })
  }
}