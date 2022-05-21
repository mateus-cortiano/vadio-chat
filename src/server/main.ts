/* main.ts */

import { Server } from './server'
import { Environment } from './config'
import { Message, ErrorMessage, EmptyMessage } from '../lib/message'

// ---

const env = new Environment()
const server = new Server(env.port, env.public_path)

server.onConnection(socket => {
  let sock_username: string | null = null

  socket.emit('connected', new Message('', '', '', env.name))

  socket.on('sendUsername', username => {
    if (!username || username.toLowerCase() === env.name.toLowerCase()) {
      socket.emit('isAuthenticated', new ErrorMessage('Invalid Username'))
      return
    }

    sock_username = username

    let message = new Message(`${sock_username} connected`, env.name)

    socket.emit('isAuthenticated', EmptyMessage)
    server.emitMessage(message)
  })

  socket.on('clientMessage', data => {
    if (sock_username === null) return
    server.emitMessage(new Message(data.content, sock_username))
  })
})

server.start()
