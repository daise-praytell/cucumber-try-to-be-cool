require('dotenv').config();
const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const { registerUser } = require('../src/services/registerService');
const { setResponse, getResponse, getCredentials, setCredentials, removeHeader } = require('./common.steps');

Given('I have valid credentials:', function(creds) {
    setCredentials(JSON.parse(creds));
});

Given('I have registration credentials without password', function() {
    setCredentials( { 'email': 'eve.holt@reqres.in' } );
});

Given('I dont have API key in header', function () {
    // setHeader(process.env.API_KEY, undefined);
    removeHeader(process.env.API_KEY);
});

When('I register', async function () { 
    setResponse(await registerUser(getCredentials()));
    // console.log('response: ', getResponse().status, getResponse().data);
});


Then('the response status code should be {int}', function (expectedStatusCode) {
    assert.strictEqual(getResponse().status, expectedStatusCode);
});

Then('the response should contain property {string}', function (expectedProperty) {
    assert.ok(
        getResponse().data[expectedProperty],
            `Expected property "${expectedProperty}" not found in response`);
});

/*
Do these in order:
	1.	Add register.feature
	2.	Extend common.steps.js with registration credentials
	3.	Extend authService.js with registerUser
	4.	Add register.steps.js
*/