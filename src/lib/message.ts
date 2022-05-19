/* message.ts */

import { SocketData } from '../interfaces/socket'

// ---

export class Message implements SocketData {
  readonly timestamp: number

  constructor(
    readonly author: string,
    readonly content: string,
    readonly event: string
  ) {
    this.timestamp = Date.now()
  }
}
