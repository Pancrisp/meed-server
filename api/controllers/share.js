const mongoose = require('mongoose')
const Share = require('../models/share')

exports.viewAll = async (req, res, next) => {
  try {
    const shares = await Share.find();
    if (!shares) {
      return res.status(404).json({
        message: 'No shares!'
      });
    } else {
      res.json(shares)
      console.log('Returned query for all shares');
    }
  } catch (err) {
    const msg = 'Error thrown when viewing all shares';
    console.log(msg);
    return res.status(500).json({
      message: msg
    });
  }
}

exports.view = async (req, res, next) => {
  try {
    const share = await Share.findOne({symbol: req.params.symbol});
    if (!share) {
      return res.status(404).json({
        message: 'No price found for symbol ' + req.params.symbol
      });
    } else {
      res.json(share)
      console.log('Returned query for price on symbol ' + share.symbol);
    }
  } catch (err) {
    const msg = 'Error thrown when viewing a share';
    console.log(msg);
    return res.status(500).json({
      message: msg
    });
  }
};
