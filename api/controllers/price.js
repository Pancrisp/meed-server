const mongoose = require('mongoose')
const Price = require('../models/price')

exports.viewAll = (req, res, next) => {
  Price.find().exec((err, prices) => {
    if (!prices) {
      return res.status(404).json({
        message: 'No prices!'
      });
    } else {
      res.json(prices)
      console.log('Returned query for all prices');
    }
  });
};

exports.view = (req, res, next) => {
  Price.findOne({symbol: req.params.symbol}).exec((err, price) => {
    if (!price) {
      return res.status(404).json({
        message: 'No price found for symbol ' + req.params.symbol
      });
    } else {
      res.json(price)
      console.log('Returned query for price on symbol ' + price.symbol);
    }
  });
};

