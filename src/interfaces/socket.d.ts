/* socket.ts */

// ---

export interface ServerToClientEvents {
  clientMessage: (d: SocketData) => void
  serverMessage: (d: SocketData) => void
}

export interface ClientToServerEvents {
  clientMessage: (d: SocketData) => void
  serverMessage: (d: SocketData) => void
}

export interface InterServerEvents {
  serverMessage: (d: SocketData) => void
  clientMessage: (d: SocketData) => void
  message: (d: SocketData) => void
  ping: () => void
}

export interface SocketData {
  timestamp: number
  author: string
  content: string
}
