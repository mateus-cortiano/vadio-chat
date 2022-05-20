/* chat.ts */

import * as $ from 'jquery'
import { Message } from '../lib/message'
import { getLocaleTimeString, shortTimeOpts } from '../lib/timestamp'

// ---

function create(tagName: string): JQuery<HTMLElement> {
  return $(document.createElement(tagName))
}

export class MainWindow {
  private username: string
  private hostname: string
  private root: JQuery<HTMLElement>
  private titlebar: JQuery<HTMLElement>
  private content: JQuery<HTMLElement>
  private msgContainerWrap: JQuery<HTMLElement>
  private messageContainer: JQuery<HTMLElement>
  private inputPrefix: JQuery<HTMLElement>
  private inputForm: JQuery<HTMLElement>
  private messageInput: JQuery<HTMLElement>
  private sendButton: JQuery<HTMLElement>

  constructor(public parent: JQuery<HTMLElement>) {
    this.hostname = ''
    this.username = ''

    this.root = create('div').attr('name', 'app-window')
    this.titlebar = create('div').attr('name', 'app-titlebar')
    this.content = create('div').attr('name', 'app-content')

    this.msgContainerWrap = create('div').attr(
      'name',
      'app-message-container-wrap'
    )

    this.messageContainer = create('div').attr('name', 'app-message-container')

    this.inputForm = create('form').attr('name', 'app-input-form')
    this.inputPrefix = create('div')
      .attr('name', 'app-input-prefix')
      .text('username>')
    this.messageInput = create('input')
      .attr('name', 'app-message-input')
      .attr('autocomplete', 'off')
    this.sendButton = create('button')
      .attr('name', 'app-send-button')
      .text('SEND')

    this.inputForm.append(this.inputPrefix)
    this.inputForm.append(this.messageInput)
    this.inputForm.append(this.sendButton)

    this.msgContainerWrap.append(this.messageContainer)
    this.content.append(this.msgContainerWrap)
    this.content.append(this.inputForm)

    this.root.append(this.titlebar)
    this.root.append(this.content)
    this.parent.append(this.root)
  }

  setTitle(title: string) {
    this.titlebar.text(title)
  }

  setHostName(hostname: string) {
    this.hostname = hostname
  }

  setUserName(username: string) {
    this.username = username
    this.inputPrefix.text(`${username.substring(0, 12)}>`)
  }

  addMessage(message: Message) {
    let timestamp = getLocaleTimeString(message.timestamp, shortTimeOpts)

    let element = create('p').attr('name', 'message-line')
    let time = create('span').text(timestamp).attr('name', 'message-time')
    let author = create('span')
      .text(message.author)
      .attr('name', 'message-author')
    let content = create('span')
      .text(message.content)
      .attr('name', 'message-content')
    let separator = create('span').text(':').attr('name', 'message-sep')
    let whitespace = create('span').text(' ')
    let whitespace2 = create('span').text(' ')

    if (message.author === this.username)
      author.attr('data-msg-author-is-self', '')

    if (message.author === this.hostname)
      author.attr('data-msg-author-is-host', '')

    element.append(time, whitespace, author, separator, whitespace2, content)

    this.messageContainer.append(element)
  }

  onsend(callback: (event: JQuery.ClickEvent) => void) {
    this.sendButton.on('click', callback)
  }

  get currentInput() {
    return this.messageInput.val() as string
  }

  clearInput() {
    this.messageInput.val('')
  }
}

export class LoginWindow {
  root: JQuery<HTMLElement>
  background: JQuery<HTMLElement>
  modal: JQuery<HTMLElement>
  inputForm: JQuery<HTMLElement>
  usernameInput: JQuery<HTMLElement>
  goButton: JQuery<HTMLElement>
  errorMessage: JQuery<HTMLElement>

  constructor(public parent: JQuery<HTMLElement>) {
    this.root = create('div')
      .attr('name', 'app-login-window')
      .attr('style', 'animation: fadein 400ms ease-in-out forwards')
    this.background = create('div').attr('name', 'app-login-bg')
    this.modal = create('div').attr('name', 'app-login-modal')
    this.inputForm = create('form').attr('name', 'app-login-form')
    this.usernameInput = create('input').attr('name', 'app-login-userinput')
    this.goButton = create('button').attr('name', 'app-login-button').text('GO')
    this.errorMessage = create('div').attr('name', 'app-login-error')

    this.inputForm.append(this.usernameInput)
    this.inputForm.append(this.goButton)
    this.modal.append(this.inputForm)
    this.modal.append(this.errorMessage)
    this.background.append(this.modal)
    this.root.append(this.background)
    this.parent.append(this.root)

    this.usernameInput.on('input', () => {
      this.hideError()
    })
  }

  displayError(error: string) {
    this.errorMessage.text(error)
    this.errorMessage.attr('style', 'display: block')
    this.shakeModal()
  }

  hideError() {
    this.errorMessage.attr('style', 'display: none')
  }

  shakeModal() {
    this.modal.attr('style', 'animation: shake 800ms ease-in-out forwards')
  }

  onsend(callback: (event: JQuery.ClickEvent) => void) {
    this.goButton.on('click', callback)
  }

  disableInputs() {
    this.goButton.attr('disabled', '')
    this.usernameInput.attr('disabled', '')
    this.usernameInput.attr('style', 'user-select: none;')
  }

  enableInputs() {
    this.goButton.removeAttr('disabled')
    this.usernameInput.removeAttr('disabled')
  }

  hideWindow() {
    this.root.attr('style', 'animation: fadeout 200ms ease-in forwards')
  }

  get currentInput() {
    return this.usernameInput.val() as string
  }
}
