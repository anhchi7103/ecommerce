const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1',
  // Don't include keyspace yet unless you've created one
});

async function connectCassandra() {
  try {
    await client.connect();
    console.log('✅ Connected to Cassandra');
  } catch (err) {
    console.error('❌ Cassandra connection failed:', err);
  }
}

module.exports = { client, connectCassandra };
