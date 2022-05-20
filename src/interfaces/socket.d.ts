/* socket.ts */

// ---

export interface ServerToClientEvents {
  connected: (d: SocketData) => void
  serverMessage: (d: SocketData) => void
  isAuthenticated: (d: SocketData) => void
}

export interface ClientToServerEvents {
  sendUsername: (d: string) => void
  clientMessage: (d: SocketData) => void
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
