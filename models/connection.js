const mongoose = require('mongoose')
const path = require('path')

const dotenv = require('dotenv')
dotenv.config({path:  process.cwd() + '/.env'})


const uri = `mongodb://127.0.0.1:27017`

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})


mongoose.connection.on('connected', () => {
  console.log(`Mongoose connection open`)
})

mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error: ' + err)
})

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected')
})

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose connection disconnected app termination')
    process.exit(1)
  })
})

