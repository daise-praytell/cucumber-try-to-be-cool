const config = require('../config/config')
const axios = require('axios');

function createApiClient() {
    return axios.create({ 
                    baseURL: config.baseURL,
                    headers: {
                        // [process.env.API_KEY]: process.env.API_KEY_VALUE,
                        ...config.headers
                    }, 
                    timeout: config.timeout 
                });
}

module.exports = { createApiClient };
