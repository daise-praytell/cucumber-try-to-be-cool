const config = require('../config/config');

async function getUser(api, userId, headers){
    try {
        return await api.get(
                config.userEndpoint + userId,
                {headers: headers}
        )
    } catch (error) {
        if (error.response) return error.response;
        throw error;
    }
}
module.exports = { getUser };