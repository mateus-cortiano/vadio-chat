/* events.ts */

export interface ServerToClientEvents {
  connected: (d: SocketData) => void
  server_message: (d: SocketData) => void
  is_authenticated: (d: SocketData) => void
  last_messages: (...d: SocketData[]) => void
}

export interface ClientToServerEvents {
  send_username: (d: string) => void
  client_message: (d: SocketData) => void
}

export interface InterServerEvents {
  ping: () => void
}

export interface SocketData {
  timestamp: number
  author: string
  content: string
  hostname: string
  err: string
}

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
