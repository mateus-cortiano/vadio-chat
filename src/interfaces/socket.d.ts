/* socket.ts */

// ---

export interface ServerToClientEvents {
  connected: (id: string) => void
  serverMessage: (d: SocketData) => void
}

export interface ClientToServerEvents {
  clientMessage: (d: SocketData) => void
}

export interface InterServerEvents {
  ping: () => void
}

export interface SocketData {
  timestamp: number
  author: string
  content: string
  event: string
}
