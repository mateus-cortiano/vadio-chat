/* index.ts */

import * as $ from 'jquery'
import * as View from './view'
import { Client } from './client'
import {
  is_valid,
  match_regex,
  not_empty_str,
  not_null,
  not_whitespace
} from '../lib/validators'

// ---

const client = new Client()
const parent = $('div[name=application]')
const chat_window = new View.ChatWindow(parent)
const login_window = new View.LoginWindow(parent)

const msg_validators = [not_empty_str, not_whitespace]
const login_validators = [not_null, match_regex(/[a-zA-Z0-9_]/)]

let username: string

// ---

chat_window.disable_inputs()

client.on_connected(data => {
  chat_window.set_title(data.hostname).set_hostname(data.hostname)
})

login_window.on_input(event => {
  let input_char = (event.originalEvent as KeyboardEvent).key
  if (!is_valid(input_char, ...login_validators)) event.preventDefault()
})

login_window.on_submit((event: JQuery.ClickEvent) => {
  event.preventDefault()

  if (!is_valid(login_window.current_input, ...msg_validators)) return

  username = login_window.current_input

  login_window.disable_inputs()
  client.send_username(username)
})

client.on_auth(authentication => {
  if (authentication.err) {
    login_window.display_error(authentication.err)
    login_window.enable_inputs()
    return
  }

  chat_window.set_username(username)
  chat_window.enable_inputs()
  login_window.hide_window()
})

client.on_last_messages((...messages) => {
  for (let message of messages)
    chat_window.add_message(message.author, message.content, message.timestamp)
})

chat_window.on_send_message(event => {
  event.preventDefault()

  if (!is_valid(chat_window.current_input, ...msg_validators)) return

  client.emit_message(chat_window.current_input)
  chat_window.clear_input()
})

client.on_server_message(message => {
  chat_window.add_message(message.author, message.content, message.timestamp)
})
