const assert = require('assert');
const axios = require('axios');

const localUrl = 'http://localhost:5000';
const remoteUrl = 'https://fierce-lake-99257.herokuapp.com';

let testUserId = 0;

describe('Users', function() {
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
  describe('delete', function() {
    it('should delete the new user', function(done) {
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
