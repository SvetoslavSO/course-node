const yargs = require('yargs')
const path = require('path')
const fs = require('fs')

const args = yargs
  .usage('Usage: node $0 [options]')
  .help('help')
  .alias('help', 'h')
  .version('1.0.0')
  .alias('version', 'v')
  .option('entry', {
    alias: 'e',
    describe: 'Указывает путь к читаемой директории',
    demandOption: true
  })
  .option('dist', {
    alias: 'd',
    describe: 'Путь куда копировать',
    default: './dist'
  })
  .option('delete', {
    alias: 'D',
    describe: 'Удалять ли?',
    default: false,
    boolean: true
  })
  .argv

const config = {
  entry: path.normalize(path.resolve(__dirname, args.entry)),
  dist: path.normalize(path.resolve(__dirname, args.dist)),
  isDelete: args.delete
}

function createDir(src, cb) {
  fs.access(src, (err) => {
    if(err) {
      fs.mkdir(src, (err) => {
        if(err) throw err
        cb()
      })
    }
    else {
      cb()
    }
  })
}

function sorter(src) {
  fs.readdir(src, (err, files) => {
    if(err) throw err
    files.forEach((file) => {
      const currentPath = path.resolve(src, file)
      
      fs.stat(currentPath, (err, stat) => {
        if(err) throw err
        if (stat.isDirectory()){
          sorter(currentPath)
        } else {
          createDir(config.dist, () => {
            const fileName = path.basename(currentPath)
            const firstLetter = fileName.slice(0, 1)
            const innerPath = path.resolve(config.dist, firstLetter)
            createDir(innerPath, () => {
              fs.copyFile(currentPath, path.resolve(innerPath, fileName), (err) => {
                if (err) throw err
              })
            })
          })
        }
      })
    })
  })
}

sorter(config.entry)