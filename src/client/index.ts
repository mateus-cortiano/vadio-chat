/* index.ts */

import * as $ from 'jquery'
import * as View from './view'
import { Client } from './client'
import { Message } from '../lib/message'
import { SocketData } from '../interfaces/socket'

// ---

const client = new Client()
const parent = $('div[name=application]')
const mainView = new View.MainWindow(parent)
const loginView = new View.LoginWindow(parent)

let username: string

client.socket.on('connected', (data: SocketData) => {
  mainView.setTitle('#vadio')
  mainView.setHostName(data.hostname)
})

loginView.onsend(event => {
  event.preventDefault()

  if (!loginView.currentInput) return

  username = loginView.currentInput

  loginView.disableInputs()
  client.socket.emit('sendUsername', username)
})

client.socket.on('isAuthenticated', (data: SocketData) => {
  if (data.err) {
    loginView.displayError(data.err)
    loginView.enableInputs()
    return
  }

  loginView.hideWindow()
  mainView.setUserName(username)
})

client.socket.on('serverMessage', (message: SocketData) => {
  mainView.addMessage(message)
})

mainView.onsend(event => {
  event.preventDefault()

  if (!mainView.currentInput) return

  let message = new Message('', mainView.currentInput)
  mainView.clearInput()
  client.socket.emit('clientMessage', message)
})
