/* message.ts */

import { SocketData } from '../interfaces/socket'

// ---

export class Message implements SocketData {
  readonly timestamp: number

  constructor(
    readonly author: string = '',
    readonly content: string = '',
    readonly err: string = '',
    readonly hostname: string = ''
  ) {
    this.timestamp = Date.now()
  }
}

export class ErrorMessage extends Message {
  constructor(err: string) {
    super('', '', err)
  }
}
