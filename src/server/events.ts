/* events.ts */

export interface ServerEvents {
  user_authenticated: (username: string) => void
  user_disconnected: (username: string) => void
}
