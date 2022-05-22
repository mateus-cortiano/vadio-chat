/* events.ts */

export interface ServerEvents {
  userAuthenticated: (username: string) => void
  userDisconnected: (username: string) => void
}
