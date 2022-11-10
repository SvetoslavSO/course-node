const { createMessage } = require('./models')
const helpers = require('./helpers/serialize')
const db = require('./models')

const initChat = (server) => {
  const wss = require('socket.io').listen(server)
  const connectUsers = {}

  wss.on('connection', (socket) => {
    const socketId = socket.id
  
    socket.on('users:connect', (data) => {
      const user = { ...data, socketId, activeRoom: null }
  
      connectUsers[socketId] = user
  
      socket.emit('users:list', Object.values(connectUsers))
      socket.broadcast.emit('users:add', user)
    })
    socket.on('message:add', async (data) => {
      try {
        const message  = await createMessage(data)
        const newMessage = helpers.serializeMessage(message)
        socket.emit('message:add', newMessage)
        socket.broadcast.to(data.roomId).emit('message:add', newMessage)
      } catch (error) {
        console.log(error)
      }
    })
    socket.on('message:history', async (data) => {
      const messageHistorySender = await db.getMessage(data.userId, data.recipientId)
      const messageHistoryReipient = await db.getMessage(data.recipientId, data.userId)
      const newArr = [...messageHistoryReipient, ...messageHistorySender]
      if(newArr != []) {
        newArr.sort((a, b) => a.date > b.date ? 1 : a.date < b.date ? -1 : 0)
        socket.emit('message:history', newArr)
      }
    })
    socket.on('disconnect', (data) => {
      delete connectUsers[socketId]
      socket.broadcast.emit('users:leave', socketId)
    })
  })
}

module.exports = initChat