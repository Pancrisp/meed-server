const assert = require('assert');
const axios = require('axios');

const localUrl = 'http://localhost:5000';
const remoteUrl = 'https://fierce-lake-99257.herokuapp.com';

function createUser(host) {
  const url = host + '/users/signup';
  return axios.post(url, {
    name: 'test',
    email: 'test',
    password: 'test'
  });
}

function deleteUser(host, userId) {
  const url = host + '/users/' + userId;
  return axios.delete(url);
}

describe('Users', function() {
  describe('signup and delete: local', function() {
    it('should create a new user and then delete it', function(done) {
      this.timeout(10000);
      createUser(localUrl)
        .then(function(res) {
          deleteUser(localUrl, res.data.user._id)
            .then(function(res) {
              if (res.status == 200) {
                done();
              }
            });
        });
    });
  });
  describe('signup and delete: remote', function() {
    it('should create a new user and then delete it', function(done) {
      this.timeout(10000);
      createUser(remoteUrl)
        .then(function(res) {
          deleteUser(remoteUrl, res.data.user._id)
            .then(function(res) {
              if (res.status == 200) {
                done();
              }
            });
        });
    });
  });
});

// vi: sw=2
