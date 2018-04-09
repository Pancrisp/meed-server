const http = require('http');
const app = require('./app');
const axios = require('axios')

const port = process.env.PORT || 5000
const server = http.createServer(app)

const SharePrice = require('./api/models/sharePrice')

console.log('Fetching prices...')

const apikey = '6GOVBYU35WIUMU2X'
const symbol = 'TLS'
const url = 'https://www.alphavantage.co/'
  + 'query?function=TIME_SERIES_DAILY&symbol='
  + symbol + '.AX&apikey=' + apikey

axios.get(url)
  .then((res) => {
    console.log('Prices fetched.')
    console.log(res.data)
    console.log("Today's price:")
    console.log(res.data['Time Series (Daily)']['2018-04-09'])
  })
  .catch((err) => {
    console.log(err)
  })

server.listen(port);
console.log('API server started on port ' + port);
