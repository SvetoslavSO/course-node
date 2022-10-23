const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const formidable = require('formidable')
let { skills, products } = require('../data.json')
let content = require('../data.json')
const { join } = require('path')

router.get('/', (req, res, next) => {
  if (!req.session.auth) {
    req.flash('login', 'Сессия Истекла!')

    return res.redirect('/login')
  }
  res.render('pages/admin', { title: 'Admin page', msgskill: req.flash('admin')[0] })
})

router.post('/skills', (req, res, next) => {
  const array = [
    req.body.age,
    req.body.concerts,
    req.body.cities,
    req.body.years,
  ]
  for(const i of array){
    if(i === ''){
      req.flash('admin', 'Не заполнены все поля!')
      return res.redirect('/admin/skills')
    }
  }
  let arrayIterator = 0
  for (const iterator of content.skills) {
    iterator.number = array[arrayIterator]
    arrayIterator++
  }
  console.log(content.skills)
  fs.writeFileSync('data.json', JSON.stringify(content))
  req.flash('admin', 'Скиллы сохранены!')
  return res.redirect('/admin/skills')
})

router.get('/skills', (req, res, next) => {
  if (!req.session.auth) {
    req.flash('login', 'Сессия Истекла!')

    return res.redirect('/login')
  }
  res.render('pages/admin', { title: 'Admin page', msgskill: req.flash('admin')[0] })
})

router.get('/upload', (req, res, next) => {
  if (!req.session.auth) {
    req.flash('login', 'Сессия Истекла!')

    return res.redirect('/login')
  }
  res.render('pages/admin', { title: 'Admin page', msgfile: req.flash('admin')[0] })
})

router.post('/upload', (req, res, next) => {
  let upload = path.join('./public', 'assets', 'img', 'products')
  let form = new formidable.IncomingForm()
  const uploadDir = path.join(process.cwd(), upload)
  form.uploadDir = uploadDir
  const numberOfFiles = fs.readdirSync(uploadDir).length

  form.parse(req,function (err, fields, files) {
    if(err) {
      return next(err)
    }

    const valid = validation(fields, files)

    if(valid.err) {
      //console.log(files.photo)
      fs.unlinkSync(files.photo.filepath)
      
      req.flash('admin', `${valid.status}`)
      return res.redirect('/admin/upload')
    } 

    const filename = path.join(upload, `Work${numberOfFiles+1}${path.extname(files.photo.originalFilename)}`)
    
    fs.rename(files.photo.filepath, filename, function (err) {
      if(err) {
        console.log(err.message)
        return
      }

      let dir = filename.slice(filename.indexOf('\\'))

      const newProduct = {
        src: dir,
        name: fields.name,
        price: fields.price
      }

      content.products.push(newProduct)

      fs.writeFileSync('data.json', JSON.stringify(content))

      req.flash('admin', 'Картинка добавлена')
      return res.redirect('/admin/upload')
    })
  })
})

const validation = (fields, files) => {
  console.lof(files)
  if (files.photo.name === '' || files.photo.size === 0) {
    return { status: 'Не загружена картинка!', err: true }
  }
  if (!fields.name) {
    return { status: 'Не указано описание картинки!', err: true }
  }
  return { status: 'Ok', err: false }
}

module.exports = router
