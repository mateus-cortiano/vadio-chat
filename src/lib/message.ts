/* message.ts */

import { SocketData } from '../interfaces/socket'

// ---

export class Message implements SocketData {
  readonly timestamp: number

  constructor(
    readonly content: string = '',
    readonly author: string = '',
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

export const EmptyMessage = new Message()
