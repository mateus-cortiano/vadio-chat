/* main.ts */

import { Server } from './server'
import { Configuration } from './config'
import { Message } from '../lib/message'

// ---

const env = new Configuration()
const server = new Server(env.port, env.public_path)

server.io.on('connection', socket => {
  let username: string | null = null

  socket.emit('connected', socket.id)

  socket.on('sendUsername', un => {
    username = un
    let message = new Message(
      env.name,
      `${username} connected`,
      'serverMessage'
    )

    socket.emit('isAuthenticated')
    server.io.emit('serverMessage', message)
  })

  socket.on('clientMessage', data => {
    if (username === null) return
    let message = new Message(username, data.content, data.event)
    server.io.emit('serverMessage', message)
  })
})

server.start()
