const assert = require('assert');
const axios = require('axios');

const mongoose = require('mongoose')
const env = require('dotenv').config()
const User = require('../api/models/user.js');

const localUrl = 'http://localhost:5000';
const remoteUrl = 'https://fierce-lake-99257.herokuapp.com';

let testUserId = 0;
let testAccountId = 0;
let token = 0;

// This is bad, it's just for testing race conditions
function busySleep(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    // do nothing
  }
}

describe('User', function() {
  describe('setup', function() {
    it('should delete any existing user with email TEST', function(done) {
      this.timeout(10000);
      mongoose.connect(`mongodb://${process.env.MLAB_USER}:${process.env.MLAB_PASS}@ds123619.mlab.com:23619/meed`)
        User.remove({email: 'TEST'}).then(function() {
          done();
        });
    });
  });
  describe('signup', function() {
    it('should create a new user', function(done) {
      this.timeout(10000);
      const url = localUrl + '/users/signup';
      axios.post(url, {
        name: 'TEST',
        email: 'TEST',
        password: 'TEST'
      }).then(function(res) {
        if (res.status == 201) {
          testUserId = res.data.user._id;
          done();
        }
      });
    });
  });
  describe('login', function() {
    it('should login as the test user', function(done) {
      this.timeout(10000);
      const url = localUrl + '/users/login';
      axios.post(url, {
        email: 'TEST',
        password: 'TEST'
      }).then(function(res) {
        if (res.status == 200) {
          token = res.data.token;
          done();
        }
      });
    });
  });
  describe('view', function() {
    it('should retrieve the test user', function(done) {
      this.timeout(10000);
      const url = localUrl + '/users/' + testUserId;
      axios.get(url).then(function(res) {
        if (res.status == 200) {
          done();
        }
      });
    });
  });
  describe('viewAll', function() {
    it('should retrieve all users', function(done) {
      this.timeout(10000);
      const url = localUrl + '/users';
      axios.get(url).then(function(res) {
        if (res.status == 200) {
          done();
        }
      });
    });
  });
});

describe('Account', function() {
  describe('create account', function() {
    this.timeout(10000);
    it('should create a new account for the test user', function(done) {
      const url = localUrl + '/accounts';
      axios.post(url, {
        token: token,
        userId: testUserId,
        name: 'TEST'
      }).then(function(res) {
        if (res.status == 201) {
          testAccountId = res.data.account._id;
          done();
        }
      });
    });
  });
  describe('view account', function() {
    this.timeout(10000);
    it('should return the new account', function(done) {
      const url = localUrl + '/accounts/' + testAccountId;
      axios.get(url).then(function(res) {
        if (res.status == 200) {
          done();
        }
      });
    });
  });
});

describe('Transaction', function() {
  describe('buy share', function() {
    it('should be able to buy a share', function(done) {
      this.timeout(10000);
      const url = localUrl + '/accounts/buy';
      axios.post(url, {
        token: token,
        accountId: testAccountId,
        symbol: 'NAB',
        quantity: 123
      }).then(function(res) {
        if (res.status == 201) {
          done();
        }
      }).catch(function(err) {
          console.log('Bad response:');
          console.log(err);
      });
    });
  });
  describe('sell share', function() {
    it('should be able to sell a share', function(done) {
      this.timeout(10000);
      const url = localUrl + '/accounts/sell';
      axios.post(url, {
        token: token,
        accountId: testAccountId,
        symbol: 'NAB',
        quantity: 123
      }).then(function(res) {
        if (res.status == 200) {
          done();
        }
      }).catch(function(err) {
          console.log('Bad response:');
          console.log(err);
      });
    });
  });
});
      
describe('Cleanup', function() {
  describe('delete account', function() {
    it("should delete the test user's account", function(done) {
      this.timeout(10000);
      const url = localUrl + '/accounts/' + testAccountId;
      axios.delete(url).then(function(res) {
        if (res.status == 200) {
          done();
        }
      });
    });
  });
  describe('delete user', function() {
    it('should delete the test user', function(done) {
      this.timeout(10000);
      const url = localUrl + '/users/' + testUserId;
      axios.delete(url).then(function(res) {
        if (res.status == 200) {
          done();
        }
      });
    });
  });
  describe('disconnect from database', function() {
    it('should disconnect from the database so node will close', function() {
      this.timeout(10000);
      mongoose.disconnect();
    });
  });
});

// vi: sw=2
