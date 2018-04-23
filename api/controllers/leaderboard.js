const mongoose = require('mongoose')
const User = require('../models/user')
const Account = require('../models/account')

exports.view = (req, res, next) => {
  //get user
  //get accounts in users that have transactions
  //find networth
  //rank them in order in array

  // let leaderboard = [];
  //
  // User.find().exec((err,users) => {
  //   users.forEach(function(user){
  //     // console.log(user);
  //
  //     user.accounts.forEach(function(id) {
  //       for(let i=0;i<user.accounts.length;i++) {
  //         Account.findById(id).exec(function(err,account) {
  //           // console.log(account.networth);
  //           // console.log(user.name);
  //           leaderboard.push({
  //             name: user.name,
  //             account: i+1,
  //             networth: account.networth
  //           });
  //         });
  //       }
  //     });
  //   });
  // });
  // console.log(leaderboard);
  // res.json(leaderboard);



  let userArray = [];
  let accountArray =[];

  User.find().exec((err,users)
  //get accounts


  //get users
};


// exports.viewAll = (req, res, next) => {
//   Share.find().exec((err, shares) => {
//     if (!shares) {
//       return res.status(404).json({
//         message: 'No shares!'
//       });
//     } else {
//       res.json(shares)
//       console.log('Returned query for all shares');
//     }
//   });
// };
