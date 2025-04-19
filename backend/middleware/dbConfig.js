// const sql = require("mssql");
const redis = require("redis");

require("dotenv").config();

const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379"
});

client.on('error', err => console.log('Redis Client Error', err));

// Connect inside an IIFE (Immediately Invoked Function Expression)
(async () => {
  try {
    await client.connect();
    console.log('✅ Connected to Redis');
  } catch (err) {
    console.error('❌ Redis connection failed:', err);
  }
})();

module.exports = client;
// SQL Server configuration
// const config = {
//   user: process.env.DB_USER, // Database username
//   password: process.env.MSSQL_SA_PASSWORD, // Database password
//   server: process.env.DB_HOST, // Server IP address
//   database: process.env.DB_NAME, // Database name
//   options: {
//     encrypt: false, // Enable encryption
//     trustServerCertificate: true,
//     port: 1433, // Server port,
//     enableArithAbort: true,
//   },
// };

// // Create a connection pool
// const poolPromise = new sql.ConnectionPool(config)
//   .connect()
//   .then((pool) => {
//     console.log("Connected to MSSQL");
//     return pool;
//   })
//   .catch((err) => {
//     console.error("Database Connection Failed! Bad Config: ", err);
//     throw err;
//   });

// module.exports = {
//   sql,
//   poolPromise,
// };


// 2) CASSANDRA CONFIG
const cassandra = require('cassandra-driver');
const cassandraClient = new cassandra.Client({
    contactPoints: [process.env.CASSANDRA_HOST || 'localhost'],
    localDataCenter: process.env.CASSANDRA_DATACENTER || 'datacenter1',
    keyspace: process.env.CASSANDRA_KEYSPACE || 'ecommerce'
});
(async () => {
    try {
        await cassandraClient.connect();
        console.log('✅ Connected to Cassandra');
    } catch (err) {
        console.error('❌ Cassandra connection failed:', err);
    }
})();

// Hàm lấy data mẫu
async function getCassandraData(query = 'SELECT * FROM your_table') {
    const result = await cassandraClient.execute(query);
    return result.rows;
}

//
// 3) EXPORT
//
module.exports = {
    //redisClient,
    cassandraClient,
    getCassandraData
};