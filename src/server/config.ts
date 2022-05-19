/* config.ts */

import { env } from 'process'
import * as dotenv from 'dotenv'
import { validateSetter, isIPAddress, isTCPPort } from '../lib/validators'

// ---

export enum Modes {
  'development',
  'production'
}

export type Mode = keyof typeof Modes

const MODES = Object.keys(Modes)

export class Configuration {
  private _host: string = ''
  private _port: number = 3000
  private _mode: Mode
  readonly pass: string
  readonly public_path: string
  readonly views_path: string

  constructor() {
    let error = dotenv.config().error
    if (error) throw error

    this.host = env.APPLICATION_SOCKET_HOST
    this.port = Number(env.APPLICATION_SOCKET_PORT)
    this.mode = env.APPLICATION_MODE as Mode
    this.pass = env.APPLICATION_SOCKET_PASS
    this.views_path = env.APPLICATION_VIEWS_PATH
    this.public_path = env.APPLICATION_PUBLIC_PATH
  }

  public get host() {
    return this._host
  }

  public get port() {
    return this._port
  }

  public get mode() {
    return this._mode
  }

  public get address() {
    return `${this.host}:${this.port}`
  }

  @validateSetter(isIPAddress)
  private set host(value: string) {
    this._host = value
  }

  @validateSetter(isTCPPort)
  private set port(value: number) {
    this._port = value
  }

  @validateSetter(isValidMode)
  private set mode(value: Mode) {
    this._mode = value
  }
}

/* Validators */

function isValidMode(subject: any): subject is Mode {
  return MODES.includes(subject)
}
