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
        name: 'test',
        email: 'test',
        password: 'test'
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
        email: 'test',
        password: 'test'
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
        userId: testUserId
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
