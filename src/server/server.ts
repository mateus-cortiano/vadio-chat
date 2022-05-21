/* server.ts */

import * as express from 'express'
import * as path from 'path'
import * as http from 'http'
import * as socketio from 'socket.io'
import * as ejs from 'ejs'

import { Logger } from '../lib/logger'

import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData
} from '../interfaces/socket'

// ---

export class Server {
  public server: http.Server
  public app: express.Express
  public io: socketio.Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >
  private logger: Logger

  constructor(public port: number, public public_path: string = '../client') {
    this.app = express()
    this.server = http.createServer(this.app)
    this.io = new socketio.Server(this.server)
    this.logger = Logger.getLogger(this.constructor.name)

    this.app
      .engine('html', ejs.renderFile)
      .set('views', path.join(__dirname, public_path))
      .set('view engine', 'html')
      .use(express.static(path.join(__dirname, public_path)))
      .use('/', (req, res) => {
        res.render('index.html')
      })

    this.onConnection(socket => {
      this.logger.info(` * ${socket.id} connected`)
    })
  }

  public emitMessage(message: SocketData) {
    this.logger.info(` > ${message.author}: ${message.content}`)
    this.io.emit('serverMessage', message)
  }

  public onConnection(callback: (socket: socketio.Socket) => void) {
    this.io.on('connection', callback)
  }

  public start() {
    this.logger.info(` * server starting @ port ${this.port}`)
    this.server.listen(this.port)
  }
}
