/* main.ts */

import { Server } from './server'
import { Configuration } from './config'
import { Message } from '../lib/message'

// ---

const SELF = '#vadio'

const env = new Configuration()
const server = new Server(env.port, env.public_path, env.mode)

server.io.on('connection', socket => {
  let message = new Message(SELF, `${socket.id} connected`, 'connection')

  socket.emit('connected', socket.id)
  server.io.emit('serverMessage', message)

  socket.on('clientMessage', data => {
    message = new Message(socket.id, data.content, data.event)
    server.io.emit('serverMessage', message)
  })
})

server.start()
