const config = require('../config/config');

async function registerUser(api, credentials, headers) {
    try {
        return await api.post(
            config.registerEndpoint,
            credentials,
            { headers: headers }
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