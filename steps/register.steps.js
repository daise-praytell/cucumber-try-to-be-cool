require('dotenv').config();
const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const { registerUser } = require('../src/services/registerService');

Given('I have valid credentials:', function(creds) {
    this.credentials = JSON.parse(creds);
});

Given('I have registration credentials without password', function() {
    this.credentials = { 'email': 'eve.holt@reqres.in' };
});

Given('I dont have API key in header', function () {
    delete this.headers[process.env.API_KEY];
});

When('I register', async function () { 
    this.response = await registerUser(this.api, this.credentials, this.headers);
    // console.log('response: ', this.response.status, this.response.data);
});


Then('the response status code should be {int}', function (expectedStatusCode) {
    assert.strictEqual(this.response.status, expectedStatusCode);
});

Then('the response should contain property {string}', function (expectedProperty) {
    assert.ok(
        this.response.data[expectedProperty],
            `Expected property "${expectedProperty}" not found in response`);
});