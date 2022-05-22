/* chat.ts */

import * as $ from 'jquery'
import { getLocaleTimeString, shortTimeOpts } from '../lib/timestamp'

// ---

function create(tagName: string): JQuery<HTMLElement> {
  return $(document.createElement(tagName))
}

export class ChatWindow {
  username: string
  hostname: string
  root: JQuery<HTMLElement>
  titlebar: JQuery<HTMLElement>
  content: JQuery<HTMLElement>
  msgContainerWrap: JQuery<HTMLElement>
  messageContainer: JQuery<HTMLElement>
  inputPrefix: JQuery<HTMLElement>
  inputForm: JQuery<HTMLElement>
  messageInput: JQuery<HTMLElement>
  sendButton: JQuery<HTMLElement>

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
    this.inputPrefix = create('div').attr('name', 'app-input-prefix').text('>')
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

  public setTitle(title: string) {
    this.titlebar.text(title)
    return this
  }

  public setHostName(hostname: string) {
    this.hostname = hostname
    return this
  }

  public setUserName(username: string) {
    this.username = username
    this.inputPrefix.text(`${username.substring(0, 12)}>`)
    return this
  }

  public get currentInput() {
    return this.messageInput.val() as string
  }

  public clearInput() {
    this.messageInput.val('')
    return this
  }

  public getInputAndClear() {
    let value = this.messageInput.val() as string
    this.clearInput()
    return value
  }

  public enableInputs() {
    this.sendButton.removeAttr('disabled')
    this.messageInput.removeAttr('disabled')
    return this
  }

  public disableInputs() {
    this.sendButton.attr('disabled', '')
    this.messageInput.attr('disabled', '')
    return this
  }

  public onSendMessage(callback: (event: JQuery.ClickEvent) => void) {
    this.sendButton.on('click', callback)
    return this
  }

  public addMessage(author: string, content: string, timestamp: number) {
    let localeTime = getLocaleTimeString(timestamp, shortTimeOpts)

    let element = create('p').attr('name', 'message-line')
    let timeEl = create('span').text(localeTime).attr('name', 'message-time')
    let authorEl = create('span').text(author).attr('name', 'message-author')
    let contentEl = create('span').text(content).attr('name', 'message-content')
    let separatorEl = create('span').text(': ').attr('name', 'message-sep')
    let whitespaceEl = create('span').text(' ')

    if (author === this.username) authorEl.attr('data-msg-author-is-self', '')
    if (author === this.hostname) authorEl.attr('data-msg-author-is-host', '')

    element.append(timeEl, whitespaceEl, authorEl, separatorEl, contentEl)

    this.messageContainer.append(element)
    return this
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
    this.usernameInput = create('input')
      .attr('name', 'app-login-userinput')
      .attr('autocomplete', 'off')
      .attr('placeholder', 'username')
      .attr('maxlength', '12')
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

  public get currentInput() {
    return this.usernameInput.val() as string
  }

  public shakeModal() {
    this.modal.toggleClass('shakeit')
    setTimeout(() => this.modal.toggleClass('shakeit'), 300)
    return this
  }

  public displayError(error: string) {
    this.errorMessage.text(error)
    this.errorMessage.attr('style', 'display: block')
    setTimeout(() => this.errorMessage.attr('style', 'display: none'), 5000)
    this.shakeModal()
    return this
  }

  public hideError() {
    this.errorMessage.attr('style', 'display: none')
    return this
  }

  public enableInputs() {
    this.goButton.removeAttr('disabled')
    this.usernameInput.removeAttr('disabled')
    return this
  }

  public disableInputs() {
    this.goButton.attr('disabled', '')
    this.usernameInput.attr('disabled', '')
    return this
  }

  public hideWindow() {
    this.root.attr('style', 'animation: fadeout 200ms ease-in forwards')
    return this
  }

  public onSubmit(callback: (event: JQuery.ClickEvent) => void) {
    this.goButton.on('click', callback)
    return this
  }

  public onInput(
    callback: (event: JQuery.TriggeredEvent<any, any, any, any>) => void
  ) {
    this.usernameInput.on('keydown', callback)
    return this
  }
}
