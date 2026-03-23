const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const { default: axios } = require('axios');

let baseUrl = 'https://reqres.in/api/';
let url = baseUrl + 'register';
let credentials;
const header = {'x-api-key': 'reqres_9a7a84f8d7644d16ad3d2561fbf648e2'};
let response;
let email, password;

Given('I have valid credentials:', function(cred) {
    credentials = JSON.parse(cred);
});

Given('I have email only', function() {
    // setEmail('eve.holt@reqres.in');
    credentials = { 'email': 'eve.holt@reqres.in'};
});

When('I register', async function () {
    try {
        response = await axios.post(
                                url, 
                                credentials,
                                {headers: header});
    } catch (error) {
        if (error.response) {
            response = error.response;
        } else {
            throw error
        }
    }
});

Then('the response status code should be {int}', function (expectedStatusCode) {
    assert.strictEqual(response.status, expectedStatusCode);
});

Then('the response should contain property {string}', function (expectedProperty) {
    assert.ok(response.data[expectedProperty]);
});

function setEmail(user_email) {
    email = user_email;
}

function getEmail() {
    return email;
}

function setPassword(user_password) {
    password = user_password;
}

function getPassword() {
    return password;
}


/*
curl -X POST 'https://reqres.in/api/register' 
-H 'x-api-key: reqres_9a7a84f8d7644d16ad3d2561fbf648e2' 
-H 'Content-Type: application/json' 
-d '{"email": "eve.holt@reqres.in", "password": "pistol"}'
*/