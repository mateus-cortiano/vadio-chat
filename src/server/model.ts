/* model.ts */

import { Message } from './message'

// ---

export class Model {
  private users: string[] = []
  private message_storage: Message[] = []

  constructor(public message_history_length = 12) {}

  get user_count() {
    return this.users.length
  }

  get messages() {
    return this.message_storage
  }

  add_message(message: Message) {
    this.message_storage.push(message)
    if (this.message_storage.length > this.message_history_length)
      this.message_storage.splice(0, 1)
  }

  user_exists(user: string): boolean {
    return this.users.includes(user)
  }

  add_user(user: string) {
    this.users.push(user)
  }

  remove_user(user: string) {
    this.users = this.users.filter(value => value !== user)
  }
}
