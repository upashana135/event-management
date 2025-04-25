// redisClient.js
const { createClient } = require('redis');

const client = createClient();

client.on('error', (err) => console.error('Redis Client Error', err));

// Connect once at app start
(async () => {
  try {
    await client.connect();
    console.log('✅ Redis connected');
  } catch (err) {
    console.error('❌ Redis connection failed', err);
  }
})();

module.exports = client;
