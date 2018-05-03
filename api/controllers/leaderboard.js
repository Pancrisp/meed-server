const mongoose = require('mongoose')
const User = require('../models/user')
const Account = require('../models/account')

function leaderboardCompare(a, b) {
  if (a.networth < b.networth) {
    return 1;
  } if (a.networth > b.networth) {
    return -1;
  }
  return 0;
}

exports.view = async (req, res, next) => {
  let leaderboard = [];

  const users = await User.find();
  const accounts = await Account.find();
  users.forEach(function(user) {
    accounts.forEach(function(account) {
      for (let i = 0; i < user.accounts.length; i++) {
        if (user.accounts[i].equals(account._id)
          && account.transactions.length > 0) {
          leaderboard.push({
            user: user.name,
            account: account.name,
            networth: account.networth
          });
        } 
      }
    });
  });
  leaderboard.sort(leaderboardCompare);
  // remove all but the first 10 elements
  leaderboard.splice(10);
  return res.json({leaderboard: leaderboard});
}

// vi: sw=2
