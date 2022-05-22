/* logger.ts */

import { get_now_timestring } from './timestamp'

/* Level */

export enum Level {
  DEBUG,
  INFO,
  WARN,
  ERROR
}

const Levels = Object.values(Level)

function get_level(level: string): Level {
  return Level[level as keyof typeof Level]
}

function get_level_name(level: Level): string {
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
      .replace('${timestamp}', get_now_timestring())
      .replace('${level}', get_level_name(level))
      .replace('${name}', name)
      .replace('${message}', message)
  }
}

/* Log Handler */

export interface LogHandler {
  level: Level
  formatter: Formatter

  set_formatter(formatter: Formatter): void
  handle(name: string, level: Level, message: string): void
}

export class ConsoleLogHandler implements LogHandler {
  constructor(
    public level: Level = Level.INFO,
    public formatter: Formatter = new DefaultFormatter()
  ) {}

  set_formatter(formatter: Formatter) {
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
    this.write_file('')
  }

  write_file(data: string) {
    this.fs.appendFile(this.path, data + '\n', (err?: Error) => {
      if (err) return console.error(err)
    })
  }

  set_formatter(formatter: Formatter) {
    this.formatter = formatter
  }

  handle(name: string, level: Level, message: string) {
    if (this.level > level) return
    let formatted = this.formatter.format(name, level, message)
    this.write_file(formatted)
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

  static get_logger(name: string): Logger {
    if (!(name in Logger.instances.keys())) {
      Logger.instances.set(name, new Logger(name))
    }
    return Logger.instances.get(name)
  }

  public set_all_levels(level: Level): Logger {
    this.level = level
    for (let handler of this.handlers) handler.level = level
    return this
  }

  public add_handler(handler: LogHandler): Logger {
    this.handlers.push(handler)
    return this
  }

  public remove_handler(handler: LogHandler): Logger {
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
    let level = get_level(levelName.toUpperCase())

    descriptor.value = function (this: Logger, message: string) {
      if (this.level > level) return

      for (let handler of this.handlers)
        handler.handle(this.name, level, message)
    }
  }
}
