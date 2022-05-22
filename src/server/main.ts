/* main.ts */

import { Server } from './server'
import { Environment } from './config'
import { Message, ErrorMessage, EmptyMessage } from '../lib/message'
import {
  maxLength,
  sanitizeString as sanitize,
  trimString
} from '../lib/sanitizers'
import { isValid, notEmptyString, notEquals } from '../lib/validators'
import { Model } from './model'

// ---

const MAX_USERNAME_LENGTH = 12

const env = new Environment()
const server = new Server(env.port, env.public_path)

const usernameValidators = [notEmptyString, notEquals(env.name)]
const usernameSanitizers = [trimString, maxLength(MAX_USERNAME_LENGTH)]

const HostnameMessage = new Message('', '', '', env.name)
const InvalidUsernameMessage = new ErrorMessage('Invalid Username')
const UsernameInUseMessage = new ErrorMessage('Username already in use')
const FullRoomMessage = new ErrorMessage('Room is full')
const UserConnectedMessage = (username: string) =>
  new Message(`${username} connected`, env.name)

// ---

server.onConnection(socket => {
  let sock_username: string | null = null

  socket.emit('connected', HostnameMessage)

  socket.on('sendUsername', username => {
    if (Model.userCount >= env.max_users) {
      socket.emit('isAuthenticated', FullRoomMessage)
      return
    }

    username = sanitize(username, ...usernameSanitizers)

    if (!isValid(username, ...usernameValidators)) {
      socket.emit('isAuthenticated', InvalidUsernameMessage)
      return
    }

    if (Model.userExists(username)) {
      socket.emit('isAuthenticated', UsernameInUseMessage)
      return
    }

    server.events.emit('userAuthenticated', username)
  })

  server.events.on('userAuthenticated', username => {
    sock_username = username
    Model.addUser(sock_username)
    socket.emit('isAuthenticated', EmptyMessage)
    server.emitMessage(UserConnectedMessage(sock_username))
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
