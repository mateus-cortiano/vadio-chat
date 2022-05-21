/* main.ts */

import { Server } from './server'
import { Environment } from './config'
import { Message, ErrorMessage, EmptyMessage } from '../lib/message'
import {
  maxLength,
  sanitizeString as sanitize,
  trimString
} from '../lib/sanitizers'
import { isValid, notEmpty, notEquals } from '../lib/validators'
import { Model } from './model'

// ---

const MAX_USERNAME_LENGTH = 12

const env = new Environment()
const server = new Server(env.port, env.public_path)

server.onConnection(socket => {
  let sock_username: string | null = null

  socket.emit('connected', new Message('', '', '', env.name))

  socket.on('sendUsername', username => {
    if (Model.userCount >= env.max_users) {
      socket.emit('isAuthenticated', new ErrorMessage('Room is full'))
      return
    }

    username = sanitize(username, trimString, maxLength(MAX_USERNAME_LENGTH))

    if (!isValid(username, notEmpty, notEquals(env.name))) {
      socket.emit('isAuthenticated', new ErrorMessage('Invalid Username'))
      return
    }

    if (Model.userExists(username)) {
      socket.emit(
        'isAuthenticated',
        new ErrorMessage('Username already in use')
      )
      return
    }

    sock_username = username
    let message = new Message(`${sock_username} connected`, env.name)

    Model.addUser(sock_username)
    socket.emit('isAuthenticated', EmptyMessage)
    server.emitMessage(message)
  })

  socket.on('clientMessage', data => {
    if (sock_username === null) return
    server.emitMessage(new Message(data.content, sock_username))
  })

  socket.on('disconnect', () => {
    Model.removeUser(sock_username)
  })
})

server.start()
