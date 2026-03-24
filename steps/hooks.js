require('dotenv').config();
const { Before } = require('@cucumber/cucumber');
const { createApiClient } = require('../src/utils/apiClient');
const { setApi, setHeader } = require('./common.steps')

Before(function(){
    setApi(createApiClient());
    setHeader(process.env.API_KEY, process.env.API_KEY_VALUE);
});