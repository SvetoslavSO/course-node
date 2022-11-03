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

module.exports.serializeNews = (news) => {
  let newNews = []
  for (let i = 0; i < news.length; i++) {
    console.log(news[i].user)
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