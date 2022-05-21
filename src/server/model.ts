/* model.ts */

export class Model {
  private static users: string[] = []

  static get userCount() {
    return this.users.length
  }

  static userExists(user: string): boolean {
    return this.users.includes(user)
  }

  static addUser(user: string) {
    this.users.push(user)
  }

  static removeUser(user: string) {
    this.users = this.users.filter(value => value !== user)
  }
}
