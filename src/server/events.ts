/* events.ts */

export interface InternalData {
  timestamp: number
  username: string
}

export interface InternalEvents {
  userAuthenticated: (username: string) => void
  userDisconnected: (data: InternalData) => void
}
