const express = require('express')
const router = express.Router()
const { products, skills } = require('../data.json')
const content = require('../data.json')
const fs = require('fs')

router.get('/', (req, res, next) => {
  res.render('pages/index', { title: 'Main page', msgemail: req.flash('main')[0], products, skills })
})

router.post('/', (req, res, next) => {
  const letter = {
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  }
  if(content.letters){
    content.letters.push(letter)
  } else {
    content.letters = []
    content.letters.push(letter)
  }
  fs.writeFileSync('data.json', JSON.stringify(content))
  req.flash('main', 'Сообщение отправлено')
  return res.redirect('/')
})

module.exports = router