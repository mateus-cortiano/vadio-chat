/* client.ts */

import { io, Socket } from 'socket.io-client'
import { SocketData } from '../interfaces/socket'
import { Message } from '../lib/message'

export class Client {
  private _id: string
  public socket: Socket

  constructor(readonly host: string = '', readonly port: number | null = null) {
    this.socket = io({ withCredentials: true })

    this.socket.on('connected', id => (this._id = id))
  }

  get id() {
    return this._id
  }

  public emit_message(content: string) {
    let message = new Message(content)
    this.socket.emit('client_message', message)
  }

  public send_username(username: string) {
    this.socket.emit('send_username', username)
  }

  public on_connected(callback: (data: SocketData) => void) {
    this.socket.on('connected', callback)
  }

  public on_server_message(callback: (data: SocketData) => void) {
    this.socket.on('server_message', callback)
  }

  public on_auth(callback: (data: SocketData) => void) {
    this.socket.on('is_authenticated', callback)
  }
}
