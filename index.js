const yargs = require('yargs')
const path = require('path')
const {mkdir, readdir, stats, copyFile} = require('./modules/fs')

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

async function sorterPromise(src){
  const files = await readdir(src)

  for (const file of files) {
    const currentPath = path.resolve(src, file)
    const stat = await stats(currentPath)
    if (stat.isDirectory()) {
      await sorterPromise(currentPath)
    } else {
      const fileName = path.basename(currentPath)
      const firstLetter = fileName.slice(0, 1)
      const innerPath = path.resolve(config.dist, firstLetter.toUpperCase())
      await mkdir(config.dist)
      await mkdir(innerPath)
      await copyFile(currentPath, path.resolve(innerPath, fileName))
      console.log(currentPath)
    }
  }
}

(async function(){
  try {
    await sorterPromise(config.entry)
    console.log('end')
  } catch (error) {
    console.log(error)
  }
}())

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
            const innerPath = path.resolve(config.dist, firstLetter.toUpperCase())
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