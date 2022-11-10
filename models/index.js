const User = require('./schemas/user')
const News = require('./schemas/news')
const Message = require('./schemas/message')
const helper = require('../helpers/serialize')
const bCrypt = require('bcryptjs')
const fs = require('fs')

const db = require('../models')

module.exports.getUserByName = async (userName) => {
  return User.findOne({ userName })
}
module.exports.getUserById = async (id) => {
  return User.findById({ _id: id })
}
module.exports.getUsers = async () => {
  return User.find()
}

module.exports.createUser = async (data) => {
  const { username, surName, firstName, middleName, password } = data
  const newUser = new User({
    userName: username,
    surName,
    firstName,
    middleName,
    image:
      'https://icons-for-free.com/iconfiles/png/512/profile+user+icon-1320166082804563970.png',
    permission: {
      chat: { C: true, R: true, U: true, D: true },
      news: { C: true, R: true, U: true, D: true },
      settings: { C: true, R: true, U: true, D: true },
    },
  })
  newUser.setPassword(password)
  const user = await newUser.save()
  return user
}

module.exports.updateUser = async (data) => {
  if (data.avatar) {
    const updatedUser = await User.findOneAndUpdate(
      {
         _id: data.id 
      },
      {
        firstName: data.firstName,
        surName: data.surName,
        middleName: data.middleName,
        image: data.avatar,
        hash : bCrypt.hashSync(data.newPassword, bCrypt.genSaltSync(10), null)
      },
      {
        new:true
      })
      
    return updatedUser
  } else {
    const updatedUser = await User.findOneAndUpdate(
      {
         _id: data.id 
      },
      {
        firstName: data.firstName,
        surName: data.surName,
        middleName: data.middleName,
        hash : bCrypt.hashSync(data.newPassword, bCrypt.genSaltSync(10), null)
      },
      {
        new:true
      })
    
    return updatedUser
  }

}

module.exports.deleteUser = async(id) => {
  return User.findOneAndDelete({_id: id})
}

module.exports.updateUserPermissions = async (user) => {
  await User.findOneAndUpdate({ _id: user.id }, { permission: user.permission }, { new: true })
}

module.exports.getAllNews = async() => {
  return News.find()
}

module.exports.createNews = async(data) => {
  const { text, title, user } = data
  const newNews = new News({
    created_at: Date.now(),
    text: text,
    title: title,
    user: {
      id: user._id,
      firstName: user.firstName,
      image: user.image,
      middleName: user.middleName,
      surName: user.surName,
      username: user.userName
    }
  })
  const singleNews = await newNews.save()
  return singleNews
}

module.exports.getNewsById = async(id) => {
  return News.findById({ _id: id })
}

module.exports.updateNews = async(news) => {
  return News.findOneAndUpdate({ _id: news.id }, { text: news.text, title: news.title }, { new: true })
}

module.exports.deleteNews = async(id) => {
  return News.findOneAndDelete({_id : id})
}

module.exports.getMessage = async (senderId, recipientId) => {
  return Message.find({senderId, recipientId})
}
 
module.exports.createMessage = async ({ senderId, recipientId, text }) => {
  const newMessage = new Message({
    recipientId: recipientId,
    senderId: senderId,
    text: text,
    date: Date.now()
  })
  const message = await newMessage.save()
  return message
}
