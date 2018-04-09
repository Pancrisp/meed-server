const http = require('http');
const app = require('./app');
const axios = require('axios')
const mongoose = require('mongoose')
const fs = require('fs');

const port = process.env.PORT || 5000
const server = http.createServer(app)

const SharePrice = require('./api/models/sharePrice')

const lines = fs.readFileSync('symbols.csv').toString().split('\n')
var symbols = []
for (var i in lines) {
  var symbol = lines[i].split(',')[0]
  if (symbol) {
    symbols.push(symbol)
  }
}
console.log('Loaded ' + symbols.length + ' symbols.')

function pad2digits(num) {
  if (num < 10) {
    return '0' + num
  } else {
    return num
  }
}

const apikey = '6GOVBYU35WIUMU2X'
symbol = 'TLS'
const url = 'https://www.alphavantage.co/'
  + 'query?function=TIME_SERIES_DAILY&symbol='
  + symbol + '.AX&apikey=' + apikey

const now = new Date()
const year = now.getFullYear()
const month = pad2digits(now.getMonth() + 1)
const day = pad2digits(now.getDate())
const datestr = year + '-' + month + '-' + day
console.log('Today: ' + datestr)

console.log('Fetching prices...')
axios.get(url)
  .then((res) => {
    console.log('Prices fetched.')
    //console.log(res.data)
    price = res.data['Time Series (Daily)'][datestr]['1. open']
    console.log("Today's price:")
    console.log(price)
    sharePrice = new SharePrice({
      _id: new mongoose.Types.ObjectId(),
      symbol: symbol,
      price: price,
      date: now
    })
    //sharePrice.save()
    console.log('Share Price saved to database:\n' + sharePrice)
  })
  .catch((err) => {
    console.log(err)
  })

server.listen(port);
console.log('API server started on port ' + port);
