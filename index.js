const http = require('http')

process.env.INTERVAL = 2000;
process.env.TIMEOUT = 20000;

const interval = process.env.INTERVAL
const timeout = process.env.TIMEOUT

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
  const currentInterval = setInterval(() => {
    if(tick < 18){
      tick = tick + 2;
      let currentDate = getCurrentDate()
      console.log(currentDate)
    }
  }, interval)
  const currentTimeout = setTimeout(() => {
    let currentDate = getCurrentDate()
    clearInterval(currentInterval);
    clearTimeout(currentTimeout)
    res.end(currentDate)
  }, timeout)
  if(req.method === 'GET') {
    currentInterval;
    currentTimeout
  }
})

server.listen(8080)