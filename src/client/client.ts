/* client.ts */

import { io, Socket } from 'socket.io-client'
import {
  ServerToClientEvents,
  ClientToServerEvents,
  SocketData,
  Message
} from '../server/events'

export class Client {
  public socket: Socket<ServerToClientEvents, ClientToServerEvents>

  constructor(readonly host: string = '', readonly port: number | null = null) {
    this.socket = io({ withCredentials: true })
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

  public on_last_messages(callback: (...data: Message[]) => void) {
    this.socket.on('last_messages', callback)
  }
}
