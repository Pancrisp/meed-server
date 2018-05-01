const assert = require('assert');
const axios = require('axios');

const localUrl = 'http://localhost:5000';
const remoteUrl = 'https://fierce-lake-99257.herokuapp.com';

let testUserId = 0;
let testAccountId = 0;

describe('User', function() {
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
    it('should create a new account for the test user', function(done) {
      const url = localUrl + '/accounts';
      axios.post(url, {
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
});

// vi: sw=2
