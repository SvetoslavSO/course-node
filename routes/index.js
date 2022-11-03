const express = require('express')
const router = express.Router()
const tokens = require('../auth/tokens')
const passport = require('passport')
const db = require('../models')
const helper = require('../helpers/serialize')

const auth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (!user || err) {
      return res.status(401).json({
        code: 401,
        message: 'Unauthorized',
      })
    }
    // TODO: check IP user
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
    }) // TODO:
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
  // TODO: compare token from DB
  const data = await tokens.refreshTokens(refreshToken)
  res.json({ ...data })
})

router
  .get('/profile', auth, async (req, res) => {
    const user = req.user
    res.json({
      ...helper.serializeUser(user),
    })
  })
  .patch('/profile', auth, async (req, res) => {
    console.log(`PATH: req.body: `)
    console.log(req.body)
    // TODO:
    const user = req.user
    res.json({
      ...helper.serializeUser(user),
    })
  })

router.get('/news', async(req, res) => {
  let news = await db.getAllNews()
  res.json({
    ...helper.serializeNews(news)
  })
})

router.get('/news/add', async(req, res) => {
  console.log('router news/add get')
  res.json({})
})

router.post('/news', async(req, res) => {
  const user = await tokens.getUserByToken(req.headers.authorization)
  const newsObj = { ...req.body, user }
  try {
    const newNews = await db.createNews(newsObj)
    let news = await db.getAllNews()
    res.json({
      ...helper.serializeNews(news)
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
})

router.post('/news/add', async(req, res) => {
  console.log('router news/add post')
  res.json({})
})

// router.get('/news/add', async(req, res) => {
//   console.log('here in news/add get')
//   res.json({
    
//   })
// })

// router.post('/news/add', async(req, res) => {
//   console.log('here in news/add post')
//   console.log(req.body)
//   try {
//     const newNews = await db.createNews(req.body)
//     res.json({
//       ...helper.serializeNews(newNews)
//     })
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ message: error.message })
//   }
// })

// router.post('news', async(req, res) => {
//   console.log('here in news post')
//   try {
//     const newNews = await db.createNews(req.body)
//     res.json({
//       ...helper.serializeNews(newNews)
//     })
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ message: error.message })
//   }
// })

module.exports = router

