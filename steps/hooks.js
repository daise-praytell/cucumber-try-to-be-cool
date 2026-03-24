require('dotenv').config();
const { Before } = require('@cucumber/cucumber');
const { createApiClient } = require('../src/utils/apiClient');

Before(function(){
    this.api = createApiClient();
    this.headers = { [process.env.API_KEY]: process.env.API_KEY_VALUE };
});