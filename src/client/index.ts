/* index.ts */

import * as $ from 'jquery'
import { Chat } from './view'
import { Message } from '../lib/message'
import { Client } from './client'

// ---

const client = new Client()

client.socket.on('serverMessage', data => Chat.add(data))

$('#send-button').on('click', event => {
  event.preventDefault()

  let element = $('input[name=message-content]')
  let content = element.val() as string

  if (!content) return

  client.send_message(content)

  element.val('')
})
