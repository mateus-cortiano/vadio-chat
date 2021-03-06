/* client.ts */

import { io, Socket } from 'socket.io-client'
import { Message, UserMessage } from '../server/message'
import {
  ServerToClientEvents,
  ClientToServerEvents,
  SocketData
} from '../server/events'

export class Client {
  public socket: Socket<ServerToClientEvents, ClientToServerEvents>

  constructor(readonly host: string = '', readonly port: number | null = null) {
    this.socket = io({ withCredentials: true })
  }

  public emit_message(content: string) {
    let message = UserMessage(content)
    this.socket.emit('client_message', message)
  }

  public send_username(username: string) {
    this.socket.emit('send_username', username)
  }

  public on_connected(callback: (data: SocketData) => void) {
    this.socket.on('connected', callback)
  }

  public on_disconnected(callback: (reason: Socket.DisconnectReason) => void) {
    this.socket.on('disconnect', callback)
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
