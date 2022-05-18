/*main.ts*/

import express = require('express')
import path = require('path')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, '../client')))
app.set('views', path.join(__dirname, '../client'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.use('/', (req, res) => {
  res.render('index.html')
})

console.log('* application starting')

server.listen(3000)
