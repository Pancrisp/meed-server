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

exports.view = (req, res, next) => {
  let userArray = [];
  let accountArray = [];
  let leaderboard = [];

  User.find()
    .then(function(users) {
      userArray = users;
    })
    .then(function() {
      Account.find()
        .then(function(accounts) {
          accountArray = accounts;
        })
        .then(function() {
          userArray.forEach(function(user) {
            accountArray.forEach(function(account) {
              for (let i = 0; i < user.accounts.length; i++) {
                if (user.accounts[i].equals(account._id)
                  && account.transactions.length > 0) {
                  let lbentry = {
                    user: user.name,
                    account: (i + 1),
                    networth: account.networth
                  };
                  leaderboard.push(lbentry);
                } 
              }
            });
          });
          leaderboard.sort(leaderboardCompare);
          // remove all but the first 10 elements
          leaderboard.splice(10);
          res.json({leaderboard: leaderboard});
        });
    });
}

