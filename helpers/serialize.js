module.exports.serializeUser = (user) => {
  return {
    firstName: user.firstName,
    id: user._id,
    image: user.image,
    middleName: user.middleName,
    permission: user.permission,
    surName: user.surName,
    username: user.userName,
  }
}

module.exports.serializeUsers = (users) => {
  let newUsers = []
  for (let i = 0; i < users.length; i++) {
    newUsers[i] = {
      firstName: users[i].firstName,
      id: users[i]._id,
      image: users[i].image,
      middleName: users[i].middleName,
      permission: users[i].permission,
      surName: users[i].surName,
      username: users[i].userName,
    }
  }
  return newUsers
}

module.exports.serializeNews = (news) => {
  let newNews = []
  for (let i = 0; i < news.length; i++) {
    newNews[i] = {
      id: news[i]._id,
      title: news[i].title,
      text: news[i].text,
      created_at: news[i].created_at,
      user: news[i].user,
    }
  }
  return newNews
}

module.exports.serializeMessage = (message) => {
  return {
    senderId: message.senderId,
    recipientId: message.recipientId,
    text: message.text
  }
}