const http = require('http');
const app = require('./app');
const axios = require('axios');
const mongoose = require('mongoose');
const fs = require('fs');

const port = process.env.PORT || 5000;
const server = http.createServer(app);

const Share = require('./api/models/share');

const apikey = '6GOVBYU35WIUMU2X';
const callFrequency = 0;

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
let missedShares = [];
let retry = true;
let startFetch = Date.now()
fetchPrices(shareList);

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

function fetchPrices(shareList, index = 0) {
  if (index + 1 >= shareList.length) {
    const elapsedTime = (Date.now() - startFetch) / 1000;
    console.log(shareList.length + ' prices fetched in '
      + elapsedTime + ' seconds.');
      // Retry symbols missed when an API call complaint was received
    if (retry && missedShares.length > 0) {
      console.log('Retrying missed symbols...');
      retry = false;
      startFetch = Date.now();
      setTimeout(fetchPrices, callFrequency, missedShares);
      return;
    }
    console.log('Fetch complete.');
    return;
  }
  // Keep this in case we throw
  let badResponse = {};
  const url = 'https://www.alphavantage.co/'
    + 'query?function=TIME_SERIES_INTRADAY&symbol='
    + shareList[index].symbol + '.AX&interval=1min&apikey=' + apikey;

  const queryTime = Date.now();
  axios.get(url)
    .then((res) => {
      // Keep this in case we throw
      badResponse = res;
      if (res.data.Information && res.data.Information.includes('call frequency')) {
        console.log('Caught call frequency complaint, trying again...')
        setTimeout(fetchPrices, callFrequency, shareList, index);
        return;
      } else if (res.data['Error Message']
        && res.data['Error Message'].includes('Invalid API call')) {
        console.log('Received API call complaint for symbol '
          + shareList[index].symbol + '. Trying next symbol...');
        if (retry) {
          missedShares.push(shareList[index]);
        }
        setTimeout(fetchPrices, callFrequency, shareList, index + 1);
        return;
      }
      // Turn the price series into an array
      const prices = Object.values(res.data['Time Series (1min)'])
      // Use the latest price
      const newPrice = prices[0]['1. open'];
      uploadSharePrice(newPrice, shareList[index]);
      // Fetch the next price after a delay
      setTimeout(fetchPrices, callFrequency, shareList, index + 1);
      return;
    })
    .catch((err) => {
      if (err.response && err.response.status
        && err.response.status == 503) {
        console.log('Server responds 503: Service unavailable.\nRetrying...');
        setTimeout(fetchPrices, callFrequency, shareList, index);
        return;
      }
      console.log('Exception thrown while fetching prices:');
      console.log(err);
    });
}

// vi: sw=2
