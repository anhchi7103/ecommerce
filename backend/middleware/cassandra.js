const cassandra = require('cassandra-driver');

// const client = new cassandra.Client({
//   contactPoints: ['127.0.0.1'],
//   localDataCenter: 'datacenter1',
//   // Don't include keyspace yet unless you've created one
// });

// async function connectCassandra() {
//   try {
//     await client.connect();
//     console.log('✅ Connected to Cassandra');
//   } catch (err) {
//     console.error('❌ Cassandra connection failed:', err);
//   }
// }

// module.exports = { client, connectCassandra };

// 2) CASSANDRA CONFIG
//const cassandra = require('cassandra-driver');
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
