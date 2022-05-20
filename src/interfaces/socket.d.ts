/* socket.ts */

// ---

export interface ServerToClientEvents {
  connected: (id: string) => void
  serverMessage: (d: SocketData) => void
  isAuthenticated: (d: AuthenticationData) => void
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
  event: string
}

export interface AuthenticationData {
  err?: string
}
