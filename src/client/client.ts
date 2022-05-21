/* client.ts */

import { io, Socket } from 'socket.io-client'
import { SocketData } from '../interfaces/socket'
import { Message } from '../lib/message'

export class Client {
  private id: string
  public socket: Socket

  constructor(readonly host: string = '', readonly port: number | null = null) {
    this.socket = io({ withCredentials: true })

    this.socket.on('connected', id => (this.id = id))
  }

  public emitMessage(content: string) {
    let message = new Message('', content)
    this.socket.emit('clientMessage', message)
  }

  public sendUserName(username: string) {
    this.socket.emit('sendUsername', username)
  }

  public onConnected(callback: (data: SocketData) => void) {
    this.socket.on('connected', callback)
  }

  public onServerMessage(callback: (data: SocketData) => void) {
    this.socket.on('serverMessage', callback)
  }

  public onAuth(callback: (data: SocketData) => void) {
    this.socket.on('isAuthenticated', callback)
  }
}
