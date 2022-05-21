/* config.ts */

import { env } from 'process'
import { validateSetter, isTCPPort } from '../lib/validators'

// ---

export enum Modes {
  'development',
  'production'
}

export type Mode = keyof typeof Modes

const MODES = Object.keys(Modes)

export class Environment {
  private _port: number = 3000
  private _mode: Mode
  readonly name: string
  readonly public_path: string
  readonly db_host: string
  readonly db_pass: string
  readonly db_user: string
  readonly db_name: string

  constructor() {
    this.port = Number(env.PORT || 5500)
    this.mode = (env.NODE_ENV || 'development') as Mode
    this.name = env.APPLICATION_NAME
    this.db_host = env.APPLICATION_DB_HOST
    this.db_pass = env.APPLICATION_DB_PASS
    this.db_user = env.APPLICATION_DB_USER
    this.db_name = env.APPLICATION_DB_NAME
    this.public_path = env.APPLICATION_PUBLIC_PATH
  }

  public get port() {
    return this._port
  }

  public get mode() {
    return this._mode
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
