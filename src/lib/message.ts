/* message.ts */

import { SocketData } from '../interfaces/socket'

// ---

const timeFormatOpts: Intl.DateTimeFormatOptions = {
  timeStyle: 'medium',
  hour12: false
}

export class Message implements SocketData {
  readonly timestamp: number

  constructor(
    readonly author: string,
    readonly content: string,
    readonly event: string
  ) {
    this.timestamp = Date.now()
  }

  toString() {
    let stamp = new Date(this.timestamp).toLocaleTimeString(
      undefined,
      timeFormatOpts
    )
    return `[${stamp}] ${this.author}: ${this.content}`
  }
}
