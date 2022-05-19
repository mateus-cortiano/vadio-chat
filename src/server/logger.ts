/* logger.ts */

// ---

export class Logger {
  private _name: string

  constructor(name: string) {
    this._name = name
  }

  get name() {
    return this._name
  }

  private get timestamp() {
    return new Date(Date.now()).toLocaleTimeString(undefined, {
      timeStyle: 'medium',
      hour12: false
    })
  }

  debug(message: string) {
    console.debug(`${this.timestamp}:${this.name}:${message}`)
  }

  info(message: string) {
    console.info(`${this.timestamp}:${this.name}:${message}`)
  }

  warn(message: string) {
    console.warn(`${this.timestamp}:${this.name}:${message}`)
  }

  error(message: string) {
    console.error(`${this.timestamp}:${this.name}:${message}`)
  }
}
