/* config.ts */

import { env } from 'process'
import * as dotenv from 'dotenv'
import { validateSetter, isIPAddress, isTCPPort } from './validators'

// ---

export class Environment {
  private _host: string = ''
  private _port: number = 3000
  private _pass: string
  private _public_path: string
  private _views_path: string

  constructor() {
    let error: Error = dotenv.config().error
    if (error) throw error

    this._pass = env.APPLICATION_SOCKET_PASS
    this._public_path = env.APPLICATION_PUBLIC_PATH
    this._views_path = env.APPLICATION_VIEWS_PATH
    this.host = env.APPLICATION_SOCKET_HOST
    this.port = Number(env.APPLICATION_SOCKET_PORT)
  }

  get host() {
    return this._host
  }

  @validateSetter(isIPAddress)
  set host(value: string) {
    this._host = value
  }

  get port() {
    return this._port
  }

  @validateSetter(isTCPPort)
  set port(value: number) {
    this._port = value
  }

  get public_path() {
    return this._public_path
  }

  get views_path() {
    return this._views_path
  }

  get address() {
    return `${this.host}:${this.port}`
  }
}
