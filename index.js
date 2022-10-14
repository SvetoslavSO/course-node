const http = require('http')
const dotenv = require('dotenv')
dotenv.config({path: './config.env'})

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
  if(req.method === 'GET') {
    const tickNumber = Math.floor(process.env.TIMEOUT / process.env.INTERVAL) - 1
    const currentInterval = setInterval(() => {
      if(tick < tickNumber){
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
    currentInterval;
    currentTimeout
  }
})

server.listen(8080)