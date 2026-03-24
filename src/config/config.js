module.exports = {
    baseURL: 'https://reqres.in/api/',
    timeout: 1000,

    headers: { 'Content-Type': 'application/json' },

    // register api
    registerEndpoint: '/register',

    // user api
    userEndpoint: '/users/'
};