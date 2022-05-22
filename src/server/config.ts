/* config.ts */

import { env } from 'process'
import { isTCPPort } from '../lib/validators'

// ---

const DEFAULT_NAME = 'chat'
const DEFAULT_PORT = 5500
const DEFAULT_MODE: Mode = 'development'
const DEFAULT_MAX_USERS = 12

// ---

export enum Modes {
  'development',
  'production'
}

export type Mode = keyof typeof Modes

const MODES = Object.keys(Modes)

export class Environment {
  readonly port: number
  readonly mode: Mode
  readonly name: string
  readonly public_path: string
  readonly db_host: string
  readonly db_pass: string
  readonly db_user: string
  readonly db_name: string
  readonly max_users: number

  constructor() {
    this.port = Number(isTCPPort(env.PORT) ? env.PORT : DEFAULT_PORT)
    this.mode = isValidMode(env.NODE_ENV) ? env.NODE_ENV : DEFAULT_MODE
    this.name = env.APPLICATION_NAME || DEFAULT_NAME
    this.db_host = env.APPLICATION_DB_HOST
    this.db_pass = env.APPLICATION_DB_PASS
    this.db_user = env.APPLICATION_DB_USER
    this.db_name = env.APPLICATION_DB_NAME
    this.public_path = env.APPLICATION_PUBLIC_PATH
    this.max_users = Number(env.APPLICATION_MAX_USERS) || DEFAULT_MAX_USERS
  }
}

/* Validators */

function isValidMode(subject: any): subject is Mode {
  return MODES.includes(subject)
}
