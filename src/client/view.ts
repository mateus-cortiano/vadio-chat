/* chat.ts */

import * as $ from 'jquery'
import { get_locale_timestring, short_time_opts } from '../lib/timestamp'

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
  message_container_wrap: JQuery<HTMLElement>
  message_container: JQuery<HTMLElement>
  input_prefix: JQuery<HTMLElement>
  input_form: JQuery<HTMLElement>
  message_input: JQuery<HTMLElement>
  send_button: JQuery<HTMLElement>

  constructor(public parent: JQuery<HTMLElement>) {
    this.hostname = ''
    this.username = ''

    this.root = create('div').attr('name', 'app-window')
    this.titlebar = create('div').attr('name', 'app-titlebar')
    this.content = create('div').attr('name', 'app-content')

    this.message_container_wrap = create('div').attr(
      'name',
      'app-message-container-wrap'
    )

    this.message_container = create('div').attr('name', 'app-message-container')

    this.input_form = create('form').attr('name', 'app-input-form')
    this.input_prefix = create('div').attr('name', 'app-input-prefix').text('>')
    this.message_input = create('input')
      .attr('name', 'app-message-input')
      .attr('maxlength', '240')
      .attr('autocomplete', 'off')
    this.send_button = create('button')
      .attr('name', 'app-send-button')
      .text('SEND')

    this.input_form.append(this.input_prefix)
    this.input_form.append(this.message_input)
    this.input_form.append(this.send_button)

    this.message_container_wrap.append(this.message_container)
    this.content.append(this.message_container_wrap)
    this.content.append(this.input_form)

    this.root.append(this.titlebar)
    this.root.append(this.content)
    this.parent.append(this.root)
  }

  public set_title(title: string) {
    this.titlebar.text(title)
    return this
  }

  public set_hostname(hostname: string) {
    this.hostname = hostname
    return this
  }

  public set_username(username: string) {
    this.username = username
    this.input_prefix.text(`${username.substring(0, 12)}>`)
    return this
  }

  public get current_input() {
    return this.message_input.val() as string
  }

  public clear_input() {
    this.message_input.val('')
    return this
  }

  public get_input_and_clear() {
    let value = this.message_input.val() as string
    this.clear_input()
    return value
  }

  public enable_inputs() {
    this.send_button.removeAttr('disabled')
    this.message_input.removeAttr('disabled')
    return this
  }

  public disable_inputs() {
    this.send_button.attr('disabled', '')
    this.message_input.attr('disabled', '')
    return this
  }

  public on_send_message(callback: (event: JQuery.ClickEvent) => void) {
    this.send_button.on('click', callback)
    return this
  }

  public add_message(author: string, content: string, timestamp: number) {
    let localeTime = get_locale_timestring(timestamp, short_time_opts)

    let element = create('p').attr('name', 'message-line')
    let timeEl = create('span').text(localeTime).attr('name', 'message-time')
    let authorEl = create('span').text(author).attr('name', 'message-author')
    let contentEl = create('span').text(content).attr('name', 'message-content')
    let separatorEl = create('span').text(': ').attr('name', 'message-sep')
    let whitespaceEl = create('span').text(' ')

    if (author === this.username) authorEl.attr('data-msg-author-is-self', '')
    if (author === this.hostname) authorEl.attr('data-msg-author-is-host', '')

    element.append(timeEl, whitespaceEl, authorEl, separatorEl, contentEl)

    this.message_container.append(element)
    return this
  }
}

export class LoginWindow {
  root: JQuery<HTMLElement>
  background: JQuery<HTMLElement>
  modal: JQuery<HTMLElement>
  input_form: JQuery<HTMLElement>
  username_input: JQuery<HTMLElement>
  go_button: JQuery<HTMLElement>
  error_message: JQuery<HTMLElement>

  constructor(public parent: JQuery<HTMLElement>) {
    this.root = create('div')
      .attr('name', 'app-login-window')
      .attr('style', 'animation: fadein 400ms ease-in-out forwards')
    this.background = create('div').attr('name', 'app-login-bg')
    this.modal = create('div').attr('name', 'app-login-modal')
    this.input_form = create('form').attr('name', 'app-login-form')
    this.username_input = create('input')
      .attr('name', 'app-login-userinput')
      .attr('autocomplete', 'off')
      .attr('placeholder', 'username')
      .attr('maxlength', '12')
    this.go_button = create('button')
      .attr('name', 'app-login-button')
      .text('GO')
    this.error_message = create('div').attr('name', 'app-login-error')

    this.input_form.append(this.username_input)
    this.input_form.append(this.go_button)
    this.modal.append(this.input_form)
    this.modal.append(this.error_message)
    this.background.append(this.modal)
    this.root.append(this.background)
    this.parent.append(this.root)

    this.username_input.on('input', () => {
      this.hide_error()
    })
  }

  public get current_input() {
    return this.username_input.val() as string
  }

  public shake_modal() {
    this.modal.toggleClass('shakeit')
    setTimeout(() => this.modal.toggleClass('shakeit'), 300)
    return this
  }

  public display_error(error: string) {
    this.error_message.text(error)
    this.error_message.attr('style', 'display: block')
    setTimeout(() => this.error_message.attr('style', 'display: none'), 5000)
    this.shake_modal()
    return this
  }

  public hide_error() {
    this.error_message.attr('style', 'display: none')
    return this
  }

  public enable_inputs() {
    this.go_button.removeAttr('disabled')
    this.username_input.removeAttr('disabled')
    return this
  }

  public disable_inputs() {
    this.go_button.attr('disabled', '')
    this.username_input.attr('disabled', '')
    return this
  }

  public show_window() {
    this.root.attr('style', 'animation: fadein 200ms ease-in forwards')
    return this
  }

  public hide_window() {
    this.root.attr('style', 'animation: fadeout 200ms ease-in forwards')
    return this
  }

  public on_submit(callback: (event: JQuery.ClickEvent) => void) {
    this.go_button.on('click', callback)
    return this
  }

  public on_input(
    callback: (event: JQuery.TriggeredEvent<any, any, any, any>) => void
  ) {
    this.username_input.on('keydown', callback)
    return this
  }
}
