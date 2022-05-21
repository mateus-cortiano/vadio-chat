/* config.ts */

import { env } from 'process'
import { validateSetter, isIPAddress, isTCPPort } from '../lib/validators'

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

  constructor() {
    this.name = env.NAME
    this.port = Number(env.PORT)
    this.mode = env.NODE_ENV as Mode
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
