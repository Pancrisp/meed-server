const axios = require('axios');
const mongoose = require('mongoose');
const fs = require('fs');
const env = require('dotenv').config()

const Share = require('./api/models/share');
const Account = require('./api/models/account');

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
fetchAllPrices(shareList)
  .then(() => {
    return updateNetWorth();
  }).then(() => {
    return fetchAllPriceHistory(shareList);
  }).then(() => {
    console.log('Finished updating');
  });

//get lastest prices
async function fetchAllPrices(shareList) {
  for (let i = 0; i < shareList.length; i++) {
    await fetchPrice(shareList[i]);
  }
  return Promise.resolve();
}

//get price history
async function fetchAllPriceHistory(shareList) {
  for (let i = 0; i < shareList.length; i++) {
    await fetchPriceHistory(shareList[i]);
  }
  return Promise.resolve();
}

async function fetchPrice(shareInfo) {
  const url = 'https://www.alphavantage.co/'
    + 'query?function=TIME_SERIES_INTRADAY&symbol='
    + shareInfo.symbol + '.AX&interval=1min&apikey='
    + process.env.APIKEY;

  try {
    res = await axios.get(url)
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
    if (!res.data['Time Series (1min)']) {
      console.log('Response was missing time series!');
      console.log('Response was:');
      console.log(res.data);
      return;
    }
    // Turn the price series into an array
    const prices = Object.values(res.data['Time Series (1min)'])
    // Use the latest closing price
    const newPrice = prices[0]['4. close'];
    uploadSharePrice(newPrice, shareInfo);
  } catch(err) {
    if (err.response && err.response.status
      && err.response.status == 503) {
      console.log('Server responds 503: Service unavailable.\nRetrying...');
      return fetchPrice(shareInfo);
    }
    console.log('Exception thrown while fetching prices:');
    console.log(err);
    console.log('Response from server was:');
    console.log(err.response);
  }
}

async function fetchPriceHistory(shareInfo) {
  const url = 'https://www.alphavantage.co/'
    + 'query?function=TIME_SERIES_DAILY&symbol='
    + shareInfo.symbol + '.AX&apikey='
    + process.env.APIKEY;

  try {
    res = await axios.get(url)
    if (res.data.Information
      && res.data.Information.includes('call frequency')) {
      console.log('Caught call frequency complaint, trying again')
      return fetchPriceHistory(shareInfo);
    } else if (res.data['Error Message']
      && res.data['Error Message'].includes('Invalid API call')) {
      console.log('Received API call complaint for symbol '
        + shareInfo.symbol);
      return;
    }
    if (!res.data['Time Series (Daily)']) {
      console.log('Response was missing time series!');
      console.log('Response was:');
      console.log(res.data);
      return;
    }
    //get the last 30 days
    const prices  = Object.values(res.data['Time Series (Daily)'])
    const dates  = Object.keys(res.data['Time Series (Daily)'])
    const numberOfDays = 30;

    priceArray = []
    //access 30 days
    for(i=0;i<=numberOfDays;i++) {
      const closingPrice = prices[i]['4. close']
      const priceDate = dates[i];
      const date = new Date(priceDate);
      priceArray.push({date: date, price: closingPrice});
    }
    uploadShareHistory(priceArray,shareInfo);
  } catch(err) {
    if (err.response && err.response.status
      && err.response.status == 503) {
      console.log('Server responds 503: Service unavailable.\nRetrying...');
      return fetchPrice(shareInfo);
    }
    console.log('Exception thrown while fetching prices:');
    console.log(err);
    console.log('Response from server was:');
    console.log(err.response);
  }
}

function uploadShareHistory(priceArray,shareInfo) {
  Share.findOne({symbol: shareInfo.symbol}, (err, share) => {
    if (err) throw err;
    if (!share) {
      console.log("Could not find share " + shareInfo.symbol + " in database")
      return;
    } else {
      //add share priceHistory
      share.priceHistory = priceArray;
      share.save();
      console.log("Updated price history for share " + shareInfo.symbol);
    }
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
      console.log('Added new price ' + shareInfo.symbol + ' ' + price);
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

async function updateNetWorth() {
  console.log('Updating net worths...');
  const accounts = await Account.find().populate('shares.share');
  accounts.forEach(function(account) {
    console.log('Account ' + account.name + ' net worth was ' + account.networth);
    let networth = account.balance;
    account.shares.forEach(function({share, quantity}) {
      networth += share.price * quantity;
    });
    account.networth = networth;
    console.log('now ' + account.networth);
    account.save();
  });
  return Promise.resolve();
}

// vi: sw=2
