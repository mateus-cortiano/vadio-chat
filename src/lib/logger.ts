/* logger.ts */

import { getNowTimeString } from './timestamp'

/* Level */

export enum Level {
  DEBUG,
  INFO,
  WARN,
  ERROR
}

const Levels = Object.values(Level)

function getLevel(level: string): Level {
  return Level[level as keyof typeof Level]
}

function getLevelName(level: Level): string {
  return Levels[level] as string
}

/* Formatting */

export interface Formatter {
  format(name: string, level: Level, message: string): string
}

export class DefaultFormatter implements Formatter {
  stringfmt = '${timestamp}:${level}:${name}:${message}'

  format(name: string, level: Level, message: string): string {
    return this.stringfmt
      .replace('${timestamp}', getNowTimeString())
      .replace('${level}', getLevelName(level))
      .replace('${name}', name)
      .replace('${message}', message)
  }
}

/* Log Handler */

export interface LogHandler {
  level: Level
  formatter: Formatter

  setFormatter(formatter: Formatter): void
  handle(name: string, level: Level, message: string): void
}

export class ConsoleLogHandler implements LogHandler {
  constructor(
    public level: Level = Level.INFO,
    public formatter: Formatter = new DefaultFormatter()
  ) {}

  setFormatter(formatter: Formatter) {
    this.formatter = formatter
  }

  handle(name: string, level: Level, message: string) {
    if (this.level > level) return

    let formatted = this.formatter.format(name, level, message)

    switch (level) {
      case Level.DEBUG:
        console.debug(formatted)
        break

      case Level.INFO:
        console.info(formatted)
        break

      case Level.WARN:
        console.warn(formatted)
        break

      case Level.ERROR:
        console.error(formatted)
        break
    }
  }
}

export class FileLogHandler implements LogHandler {
  private fs = require('fs')

  constructor(
    readonly path: string = './logger.log',
    public level: Level = Level.INFO,
    public formatter: Formatter = new DefaultFormatter()
  ) {
    this.writeFile('')
  }

  writeFile(data: string) {
    this.fs.appendFile(this.path, data + '\n', (err?: Error) => {
      if (err) return console.error(err)
    })
  }

  setFormatter(formatter: Formatter) {
    this.formatter = formatter
  }

  handle(name: string, level: Level, message: string) {
    if (this.level > level) return
    let formatted = this.formatter.format(name, level, message)
    this.writeFile(formatted)
  }
}

/* Logger */

export class Logger {
  private static instances = new Map<string, Logger>()
  private handlers: LogHandler[]

  constructor(
    readonly name: string,
    public level: Level = Level.INFO,
    handler: LogHandler = new ConsoleLogHandler()
  ) {
    this.handlers = []
    this.handlers.push(handler)
  }

  static getLogger(name: string): Logger {
    if (!(name in Logger.instances.keys())) {
      Logger.instances.set(name, new Logger(name))
    }
    return Logger.instances.get(name)
  }

  public setAllLevels(level: Level): Logger {
    this.level = level
    for (let handler of this.handlers) handler.level = level
    return this
  }

  public addHandler(handler: LogHandler): Logger {
    this.handlers.push(handler)
    return this
  }

  public removeHandler(handler: LogHandler): Logger {
    this.handlers = this.handlers.filter(v => v != handler)
    return this
  }

  @Logger.route
  debug(message: string) {}

  @Logger.route
  info(message: string) {}

  @Logger.route
  warn(message: string) {}

  @Logger.route
  error(message: string) {}

  private static route(
    target: Object,
    levelName: 'debug' | 'info' | 'warn' | 'error',
    descriptor: PropertyDescriptor
  ) {
    let level = getLevel(levelName.toUpperCase())

    descriptor.value = function (this: Logger, message: string) {
      if (this.level > level) return

      for (let handler of this.handlers)
        handler.handle(this.name, level, message)
    }
  }
}
