let api, response, credentials, header = {};

function setApi(apiInstance) {
    api = apiInstance;
}

function setCredentials(creds) {
    credentials = creds;
}

function setResponse(res) {
    response = res;
}

function setHeader(key, value) {
    header[key] = value;
}

function getApi() {
    return api;
}

function getCredentials() {
    return credentials;
}

function getResponse() {
    return response;
}

function getHeaders() {
    return header;
}

function resetHeader() {
    header = {};
}

function removeHeader(key) {
    delete header[key];
}

module.exports = {
    setApi,
    setCredentials,
    setResponse,
    setHeader,
    getApi,
    getCredentials,
    getResponse,
    getHeaders,
    resetHeader,
    removeHeader
}