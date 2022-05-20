/* client.ts */

import { io, Socket } from 'socket.io-client'
import { Message } from '../lib/message'

export class Client {
  public socket: Socket
  private _id: string
  private _host: string
  private _port: number

  constructor(host: string = '', port: number | null = null) {
    this.host = host
    this.port = port
    this.socket = io(this.address, {
      withCredentials: true
    })

    this.socket.on('connected', id => (this.id = id))
  }

  public send_message(content: string) {
    let message = new Message(this._id, content, 'clientMessage')
    this.socket.emit('clientMessage', message)
  }

  private set id(value: string) {
    this._id = value
  }

  public get address() {
    return this._host && this._port ? `${this._host}:${this._port}` : ''
  }

  private set host(value: string) {
    this._host = value
  }

  private set port(value: number) {
    this._port = value
  }
}
