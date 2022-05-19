/* logger.ts */

const timeFormatOpts: Intl.DateTimeFormatOptions = {
  timeStyle: 'medium',
  hour12: false
}

export class Logger {
  constructor(readonly name: string) {}

  private get timestamp() {
    return new Date(Date.now()).toLocaleTimeString(undefined, timeFormatOpts)
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
