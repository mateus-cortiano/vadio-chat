/* server.ts */

import * as express from 'express'
import * as path from 'path'
import * as http from 'http'
import * as socketio from 'socket.io'
import * as ejs from 'ejs'

import { Mode } from './config'
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

  constructor(
    public port: number,
    public public_path: string = '../client',
    readonly mode: Mode = 'production'
  ) {
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

    this.io.on('connection', socket => {
      this.logger.info(` * ${socket.id} connected`)

      socket.on('clientMessage', data => {
        this.logger.info(` > ${data.author}: ${data.content}`)
      })
    })
  }

  public start() {
    this.logger.info(
      ` * application starting in ${this.mode} mode @ port ${this.port}`
    )
    this.server.listen(this.port)
  }
}
