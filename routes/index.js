const express = require('express')
const router = express.Router()
const tokens = require('../auth/tokens')
const passport = require('passport')
const db = require('../models')
const url = require('url');
const helper = require('../helpers/serialize')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')

const auth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (!user || err) {
      return res.status(401).json({
        code: 401,
        message: 'Unauthorized',
      })
    }
    req.user = user
    next()
  })(req, res, next)
}

router.post('/registration', async (req, res) => {
  const { username } = req.body
  const user = await db.getUserByName(username)
  if (user) {
    return res.status(409).json({
      message: `Пользователь ${username} существует`
    })
  }
  try {
    const newUser = await db.createUser(req.body)
    const token = await tokens.createTokens(newUser)
    res.json({
      ...helper.serializeUser(newUser),
      ...token,
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: e.message })
  }
})

router.post('/login', async (req, res, next) => {
  passport.authenticate(
    'local',
    { session: false },
    async (err, user, info) => {
      if (err) {
        return next(err)
      }
      if (!user) {
        return res.status(400).json({ message: 'Не правильный логин/пароль'}) // TODO:
      }
      if (user) {
        const token = await tokens.createTokens(user)
        console.log(token)
        res.json({
          ...helper.serializeUser(user),
          ...token,
        })
      }
    },
  )(req, res, next)
})

router.post('/refresh-token', async (req, res) => {
  const refreshToken = req.headers['authorization']
  const data = await tokens.refreshTokens(refreshToken)
  res.json({ ...data })
})

router.get('/profile', auth, async (req, res) => {
  const user = req.user
  res.json({
    ...helper.serializeUser(user),
  })
})

router.patch('/profile', async(req, res) => {
  const userByToken = await tokens.getUserByToken(req.headers.authorization)
  const userId = userByToken._id  
  let form = new formidable.IncomingForm()

  form.parse(req,async function (err, fields, files) {
    if (files.avatar) {
      const filename = path.join(process.cwd(), './upload', `${userByToken.userName}${path.extname(files.avatar.originalFilename)}`)
      const filenameForDb = (`${userByToken.userName}${path.extname(files.avatar.originalFilename)}`)
      console.log(filenameForDb)
      fs.rename(files.avatar.filepath, filename, function(err) {
        if(err) {
          console.log(err)
          return
        }
      })
  
      const data = {
        id: userId,
        firstName: fields.firstName,
        middleName: fields.middleName,
        surName: fields.surName,
        oldPassword: fields.oldPassword,
        newPassword: fields.newPassword,
        avatar: filenameForDb
      }
      const user = await db.getUserByName(fields.surName)
      if (user) {
        return res.status(409).json({
          message: `Пользователь ${fields.surName} существует`
        })
      }
      if (!userByToken.validPassword(data.oldPassword)) {
        return res.status(409).json({
          message: `Неверный пароль`
        })
      }
      try {
        const newUser = await db.updateUser(data)
        res.json(helper.serializeUser(newUser))
      } catch (e) {
        console.log(e)
      }
    } else {
      const data = {
        id: userId,
        firstName: fields.firstName,
        middleName: fields.middleName,
        surName: fields.surName,
        oldPassword: fields.oldPassword,
        newPassword: fields.newPassword
      }
      const user = await db.getUserByName(fields.surName)
      if (user) {
        return res.status(409).json({
          message: `Пользователь ${fields.surName} существует`
        })
      }
      if (!userByToken.validPassword(data.oldPassword)) {
        return res.status(409).json({
          message: `Неверный пароль`
        })
      }
      try {
        const newUser = await db.updateUser(data)
        res.json(helper.serializeUser(newUser))
      } catch (e) {
        console.log(e)
      }
    }
    
  })
})

router.delete('/users/:id', async(req, res) => {
  await db.deleteUser(req.params.id)
  const users = await db.getUsers()
  res.json(helper.serializeUsers(users))
})

router.get('/news', async(req, res) => {
  let news = await db.getAllNews()
  res.json(helper.serializeNews(news))
})

router.patch('/news/:id', async(req, res) => {
  const newNews = await db.getNewsById(req.params.id)
  newNews.title = req.body.title
  newNews.text = req.body.text
  await db.updateNews(newNews)
  const news = await db.getAllNews()
  res.json(helper.serializeNews(news))
})

router.delete('/news/:id', async(req, res) => {
  await db.deleteNews(req.params.id)
  const news = await db.getAllNews()
  res.json(helper.serializeNews(news))
})

router.post('/news', async(req, res) => {
  const user = await tokens.getUserByToken(req.headers.authorization)
  const newsObj = { ...req.body, user }
  try {
    const newNews = await db.createNews(newsObj)
    let news = await db.getAllNews()
    res.json(helper.serializeNews(news))
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
})

router.get('/users', async(req, res) => {
  const users = await db.getUsers()
  res.json(helper.serializeUsers(users))
})

router.patch('/users/:id/permission', async(req, res) => {
  let user = await db.getUserById(req.params.id)
  user.permission = req.body.permission
  await db.updateUserPermissions(user)
})

module.exports = router

