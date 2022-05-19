/* main.ts */

import * as express from 'express'
import * as path from 'path'
import * as http from 'http'
import * as socketio from 'socket.io'
import { Environment } from './config'
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData
} from '../interfaces/socket'

// ---

const env = new Environment()
const app = express()
const server = http.createServer(app)
const io = new socketio.Server<
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData
>(server)

app
  .engine('html', require('ejs').renderFile)
  .use(express.static(path.join(__dirname, env.public_path)))
  .set('views', path.join(__dirname, env.views_path))
  .set('view engine', 'html')

app.use('/', (req, res) => {
  res.render('index.html')
})

io.on('connection', socket => {
  console.info(`${socket.id} connected`)

  socket.on('clientMessage', message => {
    message.author = socket.id
    message.timestamp = Date.now()
    console.log(`${message.timestamp} ${message.author}: ${message.content}`)
    io.emit('clientMessage', message)
  })
})

console.log(`* application starting @ address: ${env.address}`)

server.listen(env.port)
