/* model.ts */

import { Message } from '../lib/message'

export class model {
  private static users: string[] = []
  private static message_storage: Message[] = []

  static get user_count() {
    return this.users.length
  }

  static get messages() {
    return this.message_storage
  }

  static add_message(message: Message) {
    this.message_storage.push(message)
    if (this.message_storage.length > 10) this.message_storage.splice(0, 1)
  }

  static user_exists(user: string): boolean {
    return this.users.includes(user)
  }

  static add_user(user: string) {
    this.users.push(user)
  }

  static remove_user(user: string) {
    this.users = this.users.filter(value => value !== user)
  }
}
