/* socket.ts */

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
