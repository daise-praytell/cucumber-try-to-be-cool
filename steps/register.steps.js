require('dotenv').config();
const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true, strict: false });
const jsonpath = require('jsonpath');
const fs = require('fs');
const path = require('path');
const { registerUser } = require('../src/services/registerService');
const { getUser } = require('../src/services/userService');

Given('I have valid credentials:', function(docString) {
    this.credentials = JSON.parse(docString);
});

Given('I have registration credentials without password', function() {
    this.credentials = { 'email': 'eve.holt@reqres.in' };
});

Given('I dont have API key in header', function () {
    delete this.headers[process.env.API_KEY];
});

Given('I set bearer token {string}', function (token) {
    this.headers.Authorization = `Bearer ${token}`;
});

Given('I set query parameters:', function (dataTable) {
    this.queryParams = dataTable.rowsHash();
});


When('I register', async function () { 
    this.response = await registerUser(this.api, this.credentials, this.headers);
    // console.log('response: ', this.response.status, this.response.data);
});

When('I request user with id {int}', async function (userId) {
    this.userResp = await getUser(this.api, userId, this.headers);
});

When('I send a GET request to {string}', async function (endpoint) {
    this.response = await this.api.get(endpoint, {
        headers: this.headers,
        params: this.queryParams
    });
    this.queryParams = undefined;
});

When('I request the stored user id', async function () {
    this.userResp = await getUser(this.api, this.userId, this.headers);
});

Then('the response status code should be {int}', function (expectedStatusCode) {
    assert.strictEqual(this.response.status, expectedStatusCode);
});

Then('the response should contain property {string}', function (expectedProperty) {
    assert.ok(
        this.response.data[expectedProperty],
            `Expected property "${expectedProperty}" not found in response`);
});

Then('I store the returned user id', function () {
    this.userId = this.response.data.id;
});

Then('the response should contain user id {int}', function (expectedUserId) {
    assert.strictEqual(this.userResp.data.data.id, expectedUserId);
});

Then('the user response status code should be {int}', function (expectedStatusCode) {
    assert.strictEqual(this.userResp.status, expectedStatusCode);
});

Then('the response should match JSON schema:', function (docString) {
    const schema = JSON.parse(docString);
    const validate = ajv.compile(schema);
    const isValid = validate(this.response.data);

    assert.ok(
        isValid,
        `Schema validation failed: ${JSON.stringify(validate.errors)}`
    );
});

Then('JSONPath {string} should equal string {string}', function (path, expectedValue) {
    const results = jsonpath.query(this.response.data, path);
    assert.ok(results.length > 0, `JSONPath ${path} returned no results`);
    assert.strictEqual(results[0], expectedValue);
});

Then('JSONPath {string} should equal number {int}', function (path, expectedValue) {
    const results = jsonpath.query(this.response.data, path);
    assert.ok(results.length > 0, `JSONPath ${path} returned no results`);
    assert.strictEqual(results[0], expectedValue);
});

Then('JSONPath {string} should have length {int}', function (path, expectedLength) {
    const results = jsonpath.query(this.response.data, path);
    assert.strictEqual(results.length, expectedLength);
});

Then('JSONPath {string} should include strings:', function (path, dataTable) {
    const actualValues = jsonpath.query(this.response.data, path);
    const expectedValues = dataTable.raw().flat();

    for (const expectedValue of expectedValues) {
        assert.ok(
            actualValues.includes(expectedValue),
            `Expected value ${expectedValue} not found in JSONPath ${path}. Actual values: ${JSON.stringify(actualValues)}`
        );
    }
});

Then('JSONPath {string} should include numbers:', function (path, dataTable) {
    const actualValues = jsonpath.query(this.response.data, path);
    const expectedValues = dataTable.raw().flat().map(Number);

    for (const expectedValue of expectedValues) {
        assert.ok(
            actualValues.includes(expectedValue),
            `Expected value ${expectedValue} not found in JSONPath ${path}. Actual values: ${JSON.stringify(actualValues)}`
        );
    }
});

Then('the response should match schema {string}', function (schemaName) {
    const schema = loadSchema(schemaName);
    const validate = ajv.compile(schema);
    const isValid = validate(this.response.data);

  assert.ok(
    isValid,
    `Schema validation failed: ${JSON.stringify(validate.errors)}`
  );
});

Then('JSONPath {string} should match schema {string}', function (jsonPath, schemaName) {
    const results = jsonpath.query(this.response.data, jsonPath);
    assert.ok(results.length > 0, `JSONPath ${jsonPath} returned no results`);
        const schema = loadSchema(schemaName);
    const validate = ajv.compile(schema);

    for (const result of results) {
        const isValid = validate(result);
        assert.ok(
            isValid,
            `Schema validation failed for JSONPath ${jsonPath}: ${JSON.stringify(validate.errors)}`
        );
    }
});

function loadSchema(schemaName) {
    const schemaPath = path.join(
        __dirname,
        '../src/schemas',
        `${schemaName}.schema.json`
    );

    return JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
}
