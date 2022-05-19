/* chat.ts */

import * as $ from 'jquery'
import { Message } from '../lib/message'

// ---

export class Chat {
  private static container = $('#messages-container')

  static add(message: Message) {
    let stamp = formatedTime(message.timestamp)
    let element = $(document.createElement('div'))

    element
      .addClass(classes.box)
      .append(createDiv(classes.timestamp, stamp))
      .append(createDiv(classes.separator, ''))
      .append(createDiv(classes.author, message.author))
      .append(createDiv(classes.separator, ':'))
      .append(createDiv(classes.content, message.content))

    Chat.container.append(element)
  }
}

const classes = {
  box: 'message-box',
  timestamp: 'message-box-timestamp',
  separator: 'message-box-separator',
  author: 'message-box-author',
  content: 'message-box-content'
}

const timeOpts: Intl.DateTimeFormatOptions = {
  hour12: false,
  timeStyle: 'short'
}

function formatedTime(stamp: number): string {
  return new Date(stamp).toLocaleTimeString(undefined, timeOpts)
}

function createDiv(classes: string, content: string, id: string = '') {
  let element = document.createElement('div')

  element.id = id
  element.className = classes
  element.textContent = content

  return element
}
