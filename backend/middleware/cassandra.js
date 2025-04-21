// middleware/astraDbConfig.js
const { Client } = require("cassandra-driver");
require('dotenv').config();

const client = new Client({
    cloud: {
        secureConnectBundle: process.env.ASTRA_DB_SECURE_BUNDLE_PATH,
    },
    credentials: {
        username: process.env.ASTRA_DB_CLIENT_ID,
        password: process.env.ASTRA_DB_SECRET,
    },
});

module.exports = client;
