const mongoose = require('mongoose')

const Schema = mongoose.Schema

const messageSchema = new Schema(
  {
    senderId: {
      type: String
    },
    recipientId: {
      type: String
    },
    text: {
      type: String
    },
    date: {
      type: Date
    }
  }
)

const Message = mongoose.model('message', messageSchema)

module.exports = Message