const express = require('express')
const path = require('path')
const app = express()
const http = require('http')
const dotenv = require('dotenv')
dotenv.config({path: '../.env'})
const server = http.createServer(app)

require('./models/connection')


app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(function (_, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  )
  next()
})
app.use(express.static(path.join(__dirname, 'build')))
app.use(express.static(path.join(__dirname, 'upload')))

require('./auth/passport')

app.use('/api', require('./routes'))

app.use('*', (_req, res) => {
  const file = path.resolve(__dirname, 'build', 'index.html')
  res.sendFile(file)
})

app.use((err, _, res, __) => {
  console.log(err.stack)
  res.status(500).json({
    code: 500,
    message: err.message,
  })
})

const PORT = process.env.PORT || 3000

server.listen(PORT, function () {
  console.log('Environment', process.env.NODE_ENV)
  console.log(`Server running. Use our API on port: ${PORT}`)
})


module.exports = { app: app, server: server }