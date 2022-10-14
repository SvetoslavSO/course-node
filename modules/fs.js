const fs = require('fs')

function createDir(src, cb) {
  fs.access(src, (err) => {
    if(err) {
      fs.mkdir(src, (err) => {
        if(err) throw cb(err)
        cb()
      })
    }
    else {
      cb()
    }
  })
}

module.exports = {
  readdir (src) {
    return new Promise((resolve, reject) => {
      fs.readdir(src, (err, files) => {
        if(err) reject(err)

        resolve(files)
      })
    })
  },
  mkdir (src) {
    return new Promise((resolve, reject) => {
      createDir(src, (err) => {
        if (err) reject(err)

        resolve()
      })
    })
  },
  stats (src) {
    return new Promise ((resolve, reject) => {
      fs.stat(src, (err, stat) => {
        if (err) reject(err)

        resolve(stat)
      })
    })
  },
  copyFile (currentPath, newPath) {
    return new Promise((resolve, reject) => {
      fs.copyFile(currentPath, newPath, (err) => {
        if (err) return reject(err)

        resolve()
      })
    })
  }
}