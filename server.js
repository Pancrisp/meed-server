const http = require('http');
const app = require('./app');
const axios = require('axios');
const mongoose = require('mongoose');
const fs = require('fs');

const port = process.env.PORT || 5000;
const server = http.createServer(app);

const SharePrice = require('./api/models/sharePrice');

const lines = fs.readFileSync('symbols.csv').toString().split('\n');
var symbols = [];
lines.forEach((line) => {
  var symbol = line.split(',')[0];
  if (symbol) {
    symbols.push(symbol);
  }
});
console.log('Loaded ' + symbols.length + ' symbols.');

function pad2digits(num) {
  if (num < 10) {
    return '0' + num;
  } else {
    return num;
  }
}

const now = new Date();
const year = now.getFullYear();
const month = pad2digits(now.getMonth() + 1);
const day = pad2digits(now.getDate());
const datestr = year + '-' + month + '-' + day;
console.log('Today: ' + datestr);

const apikey = '6GOVBYU35WIUMU2X';

// Recursively fetch the prices
// (So that we get each price one at a time)
console.log('Fetching prices...');
fetchPrices(0);
// Start listening
server.listen(port);
console.log('API server started on port ' + port);

function fetchPrices(index) {
  symbol = symbols[index];
  const url = 'https://www.alphavantage.co/'
    + 'query?function=TIME_SERIES_DAILY&symbol='
    + symbol + '.AX&apikey=' + apikey;

  axios.get(url)
    .then((res) => {
      if (!res.data) {
        throw "No data in response!";
      }
      const price = res.data['Time Series (Daily)'][datestr]['1. open'];
      SharePrice.findOne({symbol: symbol}, (err, sharePrice) => {
        if (err) throw err;
        if (sharePrice) {
          sharePrice.price = price;
          sharePrice.date = now;
          console.log('Updated price ' + symbol + ' ' + price);
        } else {
          sharePrice = new SharePrice({
            _id: new mongoose.Types.ObjectId(),
            symbol: symbol,
            price: price,
            date: now
          });
          console.log('Added new price ' + symbol + ' ' + price);
        }
        sharePrice.save();
        if (index + 1 == symbols.length) {
          console.log('All ' + (index + 1) + ' prices fetched.');
        } else {
          fetchPrices(index + 1);
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

// vi: sw=2
