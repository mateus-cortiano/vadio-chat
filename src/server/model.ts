/* model.ts */

export class model {
  private static users: string[] = []

  static get user_count() {
    return this.users.length
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
