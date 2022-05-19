/* chat.ts */

import * as $ from 'jquery'

// ---

const chatContainer = $('#messages-container')
const timeOptions: Intl.DateTimeFormatOptions = {
  hour12: false,
  timeStyle: 'short'
}

function createDiv(klass: string, content: string, id: string = '') {
  let el = document.createElement('div')
  el.textContent = content
  el.className = klass
  el.id = id
  return el
}

export function addMessage(stamp: number, author: string, content: string) {
  let timestamp = new Date(stamp).toLocaleTimeString(undefined, timeOptions)
  let message = document.createElement('div')
  message.className = 'message-box'
  message.append(createDiv('message-box-timestamp', timestamp))
  message.append(createDiv('message-box-separator', ' '))
  message.append(createDiv('message-box-author', author))
  message.append(createDiv('message-box-separator', ':'))
  message.append(createDiv('message-box-content', content))
  chatContainer.append(message)
}
