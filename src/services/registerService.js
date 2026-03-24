const config = require('../config/config');
const { getApi, getHeaders } = require('../../steps/common.steps');

async function registerUser(credentials) {
    try {
        return await getApi().post(
            config.registerEndpoint,
            credentials,
            { headers: getHeaders() }
        );
    } catch (error) {
        if (error.response) {
            // console.log('error is: ', error.response);
            return error.response;
        }
        throw error;
    } 
}

module.exports = { registerUser };