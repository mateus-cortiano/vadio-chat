/* message.ts */

import { SocketData } from './events'

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

export const EmptyMessage = new Message()

export const ErrorMessage = (message: string) => new Message('', '', message)

export const DefaultMessage = (author: string, content: string) =>
  new Message(content, author)

export const HostnameMessage = (hostname: string) =>
  new Message('', '', '', hostname)

export const UserConnectedMessage = (author: string, username: string) =>
  new Message(`${username} connected`, author)

export const UserMessage = (content: string) => new Message(content)
