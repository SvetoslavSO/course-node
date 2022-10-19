const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const formidable = require('formidable')
let { skills, products } = require('../data.json')
let content = require('../data.json')
const { join } = require('path')

router.get('/', (req, res, next) => {
  // TODO: Реализовать, подстановку в поля ввода формы 'Счетчики'
  // актуальных значений из сохраненых (по желанию)
  res.render('pages/admin', { title: 'Admin page' })
})

router.post('/skills', (req, res, next) => {
  /*
  TODO: Реализовать сохранение нового объекта со значениями блока скиллов

    в переменной age - Возраст начала занятий на скрипке
    в переменной concerts - Концертов отыграл
    в переменной cities - Максимальное число городов в туре
    в переменной years - Лет на сцене в качестве скрипача
  */
  const array = [
    req.body.age,
    req.body.concerts,
    req.body.cities,
    req.body.years,
  ]
  for(const i of array){
    if(i === ''){
      res.send('Не заполнены все поля')
    }
  }
  let arrayIterator = 0
  for (const iterator of content.skills) {
    iterator.number = array[arrayIterator]
    arrayIterator++
  }
  console.log(content.skills)
  fs.writeFileSync('data.json', JSON.stringify(content))
  res.send('Скиллы сохранены')
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
      fs.unlinkSync(files.photo.path)
      return res.redirect(`/?msg=${valid.status}`)
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

    })
  })
  /* TODO:
   Реализовать сохранения объекта товара на стороне сервера с картинкой товара и описанием
    в переменной photo - Картинка товара
    в переменной name - Название товара
    в переменной price - Цена товара
    На текущий момент эта информация хранится в файле data.json  в массиве products
  */
  res.send('Товар сохранён')
})

const validation = (fields, files) => {
  if (files.photo.name === '' || files.photo.size === 0) {
    return { status: 'Не загружена картинка!', err: true }
  }
  if (!fields.name) {
    return { status: 'Не указано описание картинки!', err: true }
  }
  return { status: 'Ok', err: false }
}

module.exports = router
