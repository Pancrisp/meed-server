const mongoose = require('mongoose')
const Share = require('../models/share')

exports.viewAll = (req, res, next) => {
  Share.find().exec((err, shares) => {
    if (!shares) {
      return res.status(404).json({
        message: 'No shares!'
      });
    } else {
      res.json(shares)
      console.log('Returned query for all shares');
    }
  });
};

exports.view = (req, res, next) => {
  Share.findOne({symbol: req.params.symbol}).exec((err, share) => {
    if (!share) {
      return res.status(404).json({
        message: 'No price found for symbol ' + req.params.symbol
      });
    } else {
      res.json(share)
      console.log('Returned query for price on symbol ' + share.symbol);
    }
  });
};
