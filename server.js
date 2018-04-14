const http = require('http');
const app = require('./app');
const axios = require('axios');
const mongoose = require('mongoose');
const fs = require('fs');

const port = process.env.PORT || 5000;
const server = http.createServer(app);

const Share = require('./api/models/share');

const lines = fs.readFileSync('symbols.csv').toString().split('\n');
let stocks = [];
lines.forEach((line) => {
  const fields = line.split(',');
  let symbol = fields[0];
  let name = fields[1];
  if (symbol && name) {
    stocks.push({
      symbol: symbol,
      name: name
    });
  }
});
console.log('Loaded ' + stocks.length + ' symbols.');

const apikey = '6GOVBYU35WIUMU2X';

// Start listening
server.listen(port);
console.log('API server started on port ' + port);
// Recursively fetch the prices
// (So that we get each price one at a time)
console.log('Fetching prices...');
const startFetch = Date.now()
fetchPrices(stocks);

function pad2digits(num) {
  if (num < 10) {
    return '0' + num;
  } else {
    return num;
  }
}

const callFrequency = 1500;
// Keep these in case we throw
var lastIndex = 0;
var badResponse;
var queryTime = 0;
function fetchPrices(stocks, index = 0) {
  // Keep this in case we throw
  lastIndex = index;
  symbol = stocks[index].symbol;
  name = stocks[index].name;
  const url = 'https://www.alphavantage.co/'
    + 'query?function=TIME_SERIES_INTRADAY&symbol='
    + symbol + '.AX&interval=1min&apikey=' + apikey;

  queryTime = Date.now();
  axios.get(url)
    .then((res) => {
      if (!res.data) {
        throw 'No data in response';
      }
      // Keep this in case we throw
      badResponse = res.data;
      // Turn the price series into an array
      const prices = Object.values(res.data['Time Series (1min)'])
      // Use the latest price
      const newPrice = prices[0]['1. open'];
      const now = new Date();
      Share.findOne({symbol: symbol}, (err, share) => {
        if (err) throw err;
        if (share) {
          if (share.price == newPrice) {
            console.log('No change to price ' + symbol + ' ' + newPrice);
          } else {
            share.price = newPrice;
            share.date = now;
            share.save();
            console.log('Updated price ' + symbol + ' ' + newPrice);
          }
        } else {
          share = new Share({
            _id: new mongoose.Types.ObjectId(),
            symbol: symbol,
            price: newPrice,
            date: now,
            name: name
          });
          share.save();
          console.log('Added new price ' + symbol + ' ' + newPrice);
        }
        if (index + 1 == stocks.length) {
          const elapsedTime = (Date.now() - startFetch) / 1000;
          console.log('All ' + (index + 1) + ' prices fetched in '
            + elapsedTime + ' seconds.');
        } else {
          // Fetch the next price in 2 seconds
          setTimeout(fetchPrices, callFrequency, stocks, index + 1);
        }
      });
    })
    .catch((err) => {
      if (badResponse.Information && badResponse.Information.includes('call frequency')) {
        console.log('Caught call frequency complaint, trying again...')
        // Fetch the same price in 2 seconds
        setTimeout(fetchPrices, callFrequency, stocks, lastIndex);
      } else {
        console.log('Exception thrown while fetching prices:')
        console.log(err);
        console.log('Response from server was:')
        console.log(badResponse);
      }
    });
}

// vi: sw=2
