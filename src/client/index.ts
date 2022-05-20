/* index.ts */

import * as $ from 'jquery'
import * as View from './view'
import { Client } from './client'

// ---

const client = new Client()

$('button[name=submit-username-button]').on('click', event => {
  event.preventDefault()

  let element = $('input[name=username-input]')
  let content = element.val() as string

  if (!content) return

  View.displayElement('div[data-modalblock]')
  client.socket.emit('sendUsername', content)
})

client.socket.on('isAuthenticated', data => {
  if (data.err) {
    View.hideElement('div[data-modalblock]')
    View.showError('> ' + data.err)
    return
  }
  View.fadeElement('div[data-overlay]')
})

client.socket.on('serverMessage', data => View.Chat.add(data))

$('button[name=send-message-button]').on('click', event => {
  event.preventDefault()

  let element = $('input[name=message-content]')
  let content = element.val() as string

  if (!content) return

  client.send_message(content)

  element.val('')
})
