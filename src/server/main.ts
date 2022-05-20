/* main.ts */

import { Server } from './server'
import { Configuration } from './config'
import { ErrorMessage, Message } from '../lib/message'

// ---

const env = new Configuration()
const server = new Server(env.port, env.public_path)

server.io.on('connection', socket => {
  let username: string | null = null

  socket.emit('connected', new Message('', '', '', env.name))

  socket.on('sendUsername', un => {
    if (un.toLowerCase() === env.name.toLowerCase()) {
      socket.emit('isAuthenticated', new ErrorMessage('Invalid Username'))
      return
    }

    username = un

    let message = new Message(env.name, `${username} connected`)

    socket.emit('isAuthenticated', new Message())
    server.io.emit('serverMessage', message)
  })

  socket.on('clientMessage', data => {
    if (username === null) return
    let message = new Message(username, data.content)
    server.io.emit('serverMessage', message)
  })
})

server.start()
