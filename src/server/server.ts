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
} from './events'

// ---

export class Server {
  public http: http.Server
  public app: express.Express
  public socket: socketio.Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >
  private logger: Logger

  constructor(public port: number, public public_path: string = '../client') {
    this.app = express()
    this.http = http.createServer(this.app)
    this.socket = new socketio.Server(this.http)
    this.logger = Logger.get_logger(this.constructor.name)

    this.app
      .engine('html', ejs.renderFile)
      .set('views', path.join(__dirname, public_path))
      .set('view engine', 'html')
      .use(express.static(path.join(__dirname, public_path)))
      .use('/', (req, res) => {
        res.render('index.html')
      })

    this.on_connection(socket => {
      this.logger.info(` * ${socket.id} connected`)

      socket.on('disconnect', reason => {
        this.logger.info(` * ${socket.id} disconnected [${reason}]`)
      })
    })
  }

  public emit_message(message: SocketData) {
    this.logger.info(` > ${message.author}: ${message.content}`)
    this.socket.emit('server_message', message)
  }

  public on_connection(callback: (socket: socketio.Socket) => void) {
    this.socket.on('connection', callback)
  }

  public start() {
    this.logger.info(` * server starting @ port ${this.port}`)
    this.http.listen(this.port)
  }
}
