/* client.ts */

import { io, Socket } from 'socket.io-client'
import { Message } from '../lib/message'

export class Client {
  private id: string
  public socket: Socket

  constructor(readonly host: string = '', readonly port: number | null = null) {
    this.socket = io({ withCredentials: true })

    this.socket.on('connected', id => (this.id = id))
  }

  public send_message(content: string) {
    let message = new Message(this.id, content, 'clientMessage')
    this.socket.emit('clientMessage', message)
  }
}
