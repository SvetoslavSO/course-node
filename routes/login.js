const express = require('express')
const router = express.Router()

const user = {
  email: 'validMail@mail.com',
  password: '123123'
}

router.get('/', (req, res, next) => {
  res.render('pages/login', { title: 'SigIn page' })
})

router.post('/', (req, res, next) => {
  // TODO: Реализовать функцию входа в админ панель по email и паролю
  if(req.body.email === user.email && req.body.password === user.password) {
    res.render('pages/admin', { title: 'Admin page' })
  } else {
    res.send('Неправильный логин или пароль')
  }
  //res.send('Реализовать функцию входа по email и паролю')
})

module.exports = router
