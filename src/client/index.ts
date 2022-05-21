/* index.ts */

import * as $ from 'jquery'
import * as View from './view'
import { Client } from './client'
import { Message } from '../lib/message'
import { SocketData } from '../interfaces/socket'

// ---

const client = new Client()
const parent = $('div[name=application]')
const mainWindow = new View.MainWindow(parent)
const loginWindow = new View.LoginWindow(parent)

let username: string

client.socket.on('connected', (data: SocketData) => {
  mainWindow.setTitle(data.hostname)
  mainWindow.setHostName(data.hostname)
})

loginWindow.onSendMessage(event => {
  event.preventDefault()

  if (!loginWindow.currentInput) return

  username = loginWindow.currentInput

  loginWindow.disableInputs()
  client.socket.emit('sendUsername', username)
})

client.socket.on('isAuthenticated', (data: SocketData) => {
  if (data.err) {
    loginWindow.displayError(data.err)
    loginWindow.enableInputs()
    return
  }

  mainWindow.setUserName(username)
  loginWindow.hideWindow()
})

client.socket.on('serverMessage', (message: SocketData) => {
  mainWindow.addMessage(message)
})

mainWindow.onSendUserName(event => {
  event.preventDefault()

  if (!mainWindow.currentInput) return

  let message = new Message('', mainWindow.currentInput)

  client.socket.emit('clientMessage', message)
  mainWindow.clearInput()
})
