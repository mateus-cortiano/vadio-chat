/* index.ts */

import * as $ from 'jquery'
import { Chat, hideElement } from './view'
import { Client } from './client'

// ---

const client = new Client()

$('button[name=submit-username-button]').on('click', event => {
  event.preventDefault()

  let element = $('input[name=username-input]')
  let content = element.val() as string

  if (!content) return

  client.socket.emit('sendUsername', content)
})

client.socket.on('isAuthenticated', () => {
  hideElement('div[data-overlay]')
})

client.socket.on('serverMessage', data => Chat.add(data))

$('button[name=send-message-button]').on('click', event => {
  event.preventDefault()

  let element = $('input[name=message-content]')
  let content = element.val() as string

  if (!content) return

  client.send_message(content)

  element.val('')
})
