const axios = require('axios');
const mongoose = require('mongoose');
const fs = require('fs');
const env = require('dotenv').config()

const Share = require('./api/models/share');

mongoose.Promise = global.Promise
// Connect to mLab database server
mongoose.connect(`mongodb://${process.env.MLAB_USER}:${process.env.MLAB_PASS}@ds123619.mlab.com:23619/meed`)
//mongoose.connect(`mongodb://localhost/meed`)

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

console.log('Fetching prices...');
fetchAllPrices(shareList);

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
    + shareInfo.symbol + '.AX&interval=1min&apikey='
    + process.env.APIKEY;

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
      // Use the latest closing price
      const newPrice = prices[0]['4. close'];
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

// vi: sw=2
