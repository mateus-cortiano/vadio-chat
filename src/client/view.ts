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

export function fadeElement(html: string, duration: number = 1000) {
  $(html).attr('style', `animation: fadeout ${duration}ms ease forwards`)
}

export function fadeInElement(html: string, duration: number = 1000) {
  $(html).attr('style', `animation: fade ${duration}ms ease forwards`)
}

export function displayElement(html: string) {
  $(html).attr('style', `display: block`)
}

export function hideElement(html: string) {
  $(html).attr('style', `display: none`)
}

export function showError(err: string) {
  let attribute = 'div[data-error]'
  $(attribute).text(err)
  displayElement(attribute)
}

export function hideError() {
  let attribute = 'div[data-error]'
  $(attribute).text('')
  hideElement(attribute)
}
