/* main.ts */

import { Server } from './server'
import { Environment } from './config'
import { Message, ErrorMessage, EmptyMessage } from './events'
import { max_len, sanitize_str as sanitize, trim_str } from '../lib/sanitizers'
import { is_valid, not_empty_str, not_equals } from '../lib/validators'
import { Model } from './model'

// ---

const MAX_MESSAGE_LENGTH = 240
const MAX_USERNAME_LENGTH = 12
const MESSAGE_HISTORY_LENGTH = 10

const env = new Environment()
const server = new Server(env.port, env.public_path)
const model = new Model(MESSAGE_HISTORY_LENGTH)

const username_validators = [not_empty_str, not_equals(env.name)]
const username_sanitizers = [trim_str, max_len(MAX_USERNAME_LENGTH)]
const message_sanitizers = [trim_str, max_len(MAX_MESSAGE_LENGTH)]

const HostnameMessage = new Message('', '', '', env.name)
const InvalidUsernameMessage = new ErrorMessage('Invalid Username')
const UsernameInUseMessage = new ErrorMessage('Username already in use')
const FullRoomMessage = new ErrorMessage('Room is full')
const UserConnectedMessage = (username: string) =>
  new Message(`${username} connected`, env.name)

// ---

server.on_connection(socket => {
  let sock_username: string | null = null

  socket.emit('connected', HostnameMessage)

  socket.on('send_username', username => {
    if (model.user_count >= env.max_users) {
      socket.emit('is_authenticated', FullRoomMessage)
      return
    }

    username = sanitize(username, ...username_sanitizers)

    if (!is_valid(username, ...username_validators)) {
      socket.emit('is_authenticated', InvalidUsernameMessage)
      return
    }

    if (model.user_exists(username)) {
      socket.emit('is_authenticated', UsernameInUseMessage)
      return
    }

    sock_username = username

    model.add_user(sock_username)
    socket.emit('is_authenticated', EmptyMessage)
    server.emit_message(UserConnectedMessage(sock_username))
    socket.emit('last_messages', ...model.messages)
  })

  socket.on('client_message', data => {
    if (sock_username === null) return

    let content = sanitize(data.content, ...message_sanitizers)
    let message = new Message(content, sock_username)

    model.add_message(message)
    server.emit_message(message)
  })

  socket.on('disconnect', () => {
    model.remove_user(sock_username)
  })
})

server.start()
