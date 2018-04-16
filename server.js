const http = require('http');
const app = require('./app');
const axios = require('axios');
const mongoose = require('mongoose');
const fs = require('fs');

const port = process.env.PORT || 5000;
const server = http.createServer(app);

const Share = require('./api/models/share');

const APIKEY = '6GOVBYU35WIUMU2X';

const lines = fs.readFileSync('symbols.csv').toString().split('\n');
let shareList = [];
lines.forEach((line) => {
  const fields = line.split(',');
  let symbol = fields[0];
  let name = fields[1];
  if (symbol && name) {
    shareList.push({
      symbol: symbol,
      name: name
    });
  }
});
console.log('Loaded ' + shareList.length + ' symbols.');

// Start listening
server.listen(port);
console.log('API server started on port ' + port);
// Recursively fetch the prices
// (So that we get each price one at a time)
console.log('Fetching prices...');
fetchAllPrices(shareList);

function uploadSharePrice(price, shareInfo) {
  Share.findOne({symbol: shareInfo.symbol}, (err, share) => {
    if (err) throw err;
    if (!share) {
      share = new Share({
        _id: new mongoose.Types.ObjectId(),
        symbol: shareInfo.symbol,
        price: price,
        date: Date.now(),
        name: shareInfo.name
      });
      share.save();
      console.log('Added new price ' + symbol + ' ' + newPrice);
    } else {
      if (share.price == price) {
        console.log('No change to price ' + shareInfo.symbol + ' ' + price);
      } else {
        share.price = price;
        share.date = Date.now();
        share.save();
        console.log('Updated price ' + shareInfo.symbol + ' ' + price);
      }
    }
  });
}

function fetchAllPrices(shareList) {
  // Build a chain of promises
  let chain = Promise.resolve();
  for (let i = 0; i < shareList.length; i++) {
    chain = chain.then(() => {
      return fetchPrice(shareList[i]);
    });
  }
}

function fetchPrice(shareInfo) {
  const url = 'https://www.alphavantage.co/'
    + 'query?function=TIME_SERIES_INTRADAY&symbol='
    + shareInfo.symbol + '.AX&interval=1min&apikey=' + APIKEY;

  return axios.get(url)
    .then((res) => {
      if (res.data.Information
        && res.data.Information.includes('call frequency')) {
        console.log('Caught call frequency complaint, trying again')
        return fetchPrice(shareInfo);
      } else if (res.data['Error Message']
        && res.data['Error Message'].includes('Invalid API call')) {
        console.log('Received API call complaint for symbol '
          + shareInfo.symbol);
        return;
      }
      // Turn the price series into an array
      const prices = Object.values(res.data['Time Series (1min)'])
      // Use the latest price
      const newPrice = prices[0]['1. open'];
      uploadSharePrice(newPrice, shareInfo);
    })
    .catch((err) => {
      if (err.response && err.response.status
        && err.response.status == 503) {
        console.log('Server responds 503: Service unavailable.\nRetrying...');
        return fetchPrice(shareInfo);
      }
      console.log('Exception thrown while fetching prices:');
      console.log(err);
      console.log('Response from server was:');
      console.log(err.response);
    });
}

// vi: sw=2
