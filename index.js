const http = require('http')
const yargs = require('yargs')

const args = yargs
  .usage('Usage: node $0 [options]')
  .help('help')
  .alias('help', 'h')
  .version('1.0.0')
  .alias('version', 'v')
  .option('interval', {
    alias: 'i',
    describe: 'interval time',
    default: '2000'
  })
  .option('timeout', {
    alias: 't',
    describe: 'timeout time',
    default: '20000'
  })
  .argv

const config = {
  interval: args.interval,
  timeout: args.timeout
}

process.env.INTERVAL = config.interval;
process.env.TIMEOUT = config.timeout;

function getCurrentDate () {
  let today = new Date()
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const hour = today.getHours();
  const min = today.getMinutes();
  const sec = today.getSeconds();
  const answer = `current time: ${hour}:${min}:${sec}; current date: ${day}/${month}/${year}`
  return answer
}

let tick = 0;

const server = http.createServer((req, res) => {
  const tickNumber = Math.floor(process.env.TIMEOUT / process.env.INTERVAL) - 1
  console.log(tickNumber)
  const currentInterval = setInterval(() => {
    if(tick <= tickNumber){
      tick = tick + 1;
      let currentDate = getCurrentDate()
      console.log(currentDate)
    }
  }, process.env.INTERVAL)
  const currentTimeout = setTimeout(() => {
    let currentDate = getCurrentDate()
    clearInterval(currentInterval);
    clearTimeout(currentTimeout)
    res.end(currentDate)
  }, process.env.TIMEOUT)
  if(req.method === 'GET') {
    currentInterval;
    currentTimeout
  }
})

server.listen(8080)