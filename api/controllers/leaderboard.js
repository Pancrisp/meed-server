const mongoose = require('mongoose')
const User = require('../models/user')
const Account = require('../models/account')

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
          // in here
          userArray.forEach(function(user) {
            accountArray.forEach(function(account) {
              for (let i = 0; i < user.accounts.length; i++) {
                if (user.accounts[i].equals(account._id)) {
                  let lbentry = {
                    user: user.name,
                    account: (i + 1),
                    networth: account.networth
                  };
                  console.log('pushing to leaderboard:');
                  console.log(lbentry);
                  leaderboard.push(lbentry);
                } 
              }
            });
          });
          res.json({leaderboard: leaderboard});
        });
    });
}

