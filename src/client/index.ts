/* index.ts */

import * as $ from 'jquery'
import { Chat } from './view'
import { Message } from '../lib/message'
import { Client } from './client'

// ---

const client = new Client('127.0.0.1', 3000)

client.socket.on('serverMessage', (data: Message) => {
  Chat.add(data)
})

$('#send-button').on('click', event => {
  event.preventDefault()

  let element = $('input[name=message-content]')
  let content = element.val() as string

  if (!content) return

  client.send_message(content)

  element.val('')
})
