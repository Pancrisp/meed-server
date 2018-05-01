const assert = require('assert');
const axios = require('axios');

const localUrl = 'http://localhost:5000';

describe('Users', function() {
    describe('signup-local', function() {
        it('should create a new user', function(done) {
            const url = localUrl + '/users/signup';
            axios.post(url, {
                name: 'test',
                email: 'test',
                password: 'test'
            }).then(function(res) {
                console.log(res);
            });
        });
    });
});
