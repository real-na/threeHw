const axios = require('axios');

const request = axios.create({
    baseURL:'http://localhost:2008',
    timeout:5000,
});

module.exports = request;