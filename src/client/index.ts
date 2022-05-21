/* index.ts */

import * as $ from 'jquery'
import * as View from './view'
import { Client } from './client'
import { Message } from '../lib/message'
import { SocketData } from '../interfaces/socket'

// ---

const client = new Client()
const parent = $('div[name=application]')
const chatWindow = new View.ChatWindow(parent)
const loginWindow = new View.LoginWindow(parent)

let username: string

client.onConnected((data: SocketData) => {
  chatWindow.setTitle(data.hostname)
  chatWindow.setHostName(data.hostname)
})

loginWindow.onSubmit(event => {
  event.preventDefault()

  if (!loginWindow.currentInput) return

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
  loginWindow.hideWindow()
})

chatWindow.onSendMessage(event => {
  event.preventDefault()

  if (!chatWindow.currentInput) return

  client.emitMessage(chatWindow.currentInput)
  chatWindow.clearInput()
})

client.onServerMessage((message: SocketData) => {
  chatWindow.addMessage(message)
})
