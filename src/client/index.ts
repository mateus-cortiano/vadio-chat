/* index.ts */

import * as $ from 'jquery'
import * as View from './view'
import { Client } from './client'
import { SocketData } from '../interfaces/socket'
import {
  isValid,
  matchRegex,
  notEmptyString,
  notNull,
  notWhiteSpace
} from '../lib/validators'

// ---

const client = new Client()
const parent = $('div[name=application]')
const chatWindow = new View.ChatWindow(parent)
const loginWindow = new View.LoginWindow(parent)

const inputValidators = [notEmptyString, notWhiteSpace, matchRegex(/[\w\d]/g)]
const loginInputValidators = [notNull, matchRegex(/[a-zA-Z0-9_]/)]

let username: string

// ---

chatWindow.disableInputs()

client.onConnected((data: SocketData) => {
  chatWindow.setTitle(data.hostname).setHostName(data.hostname)
})

loginWindow.onInput(event => {
  let inputChar = (event.originalEvent as KeyboardEvent).key
  if (!isValid(inputChar, ...loginInputValidators)) event.preventDefault()
})

loginWindow.onSubmit((event: JQuery.ClickEvent) => {
  event.preventDefault()

  if (!isValid(loginWindow.currentInput, ...inputValidators)) return

  username = loginWindow.currentInput

  loginWindow.disableInputs()
  client.sendUserName(username)
})

client.onAuth((authentication: SocketData) => {
  if (authentication.err) {
    loginWindow.displayError(authentication.err)
    loginWindow.enableInputs()
    return
  }

  chatWindow.setUserName(username)
  chatWindow.enableInputs()
  loginWindow.hideWindow()
})

chatWindow.onSendMessage(event => {
  event.preventDefault()

  if (!isValid(chatWindow.currentInput, ...inputValidators)) return

  client.emitMessage(chatWindow.currentInput)
  chatWindow.clearInput()
})

client.onServerMessage((message: SocketData) => {
  chatWindow.addMessage(message.author, message.content, message.timestamp)
})
