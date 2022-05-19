/* index.ts */

import * as $ from 'jquery'
import { io } from 'socket.io-client'
import { addMessage } from './chat'
import { SocketData } from '../interfaces/socket'

// ---

let socket = io('http://127.0.0.1:3000')

socket.on('clientMessage', (data: SocketData) => {
  addMessage(data.timestamp, data.author, data.content)
})

$('#send-button').on('click', event => {
  event.preventDefault()
  let content = $('input[name=message-content]').val()
  socket.emit('clientMessage', {
    timestamp: 0,
    author: '',
    content: content
  })
})

console.info('* application running')
