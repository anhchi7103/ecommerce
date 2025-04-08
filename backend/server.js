require("dotenv").config();
const express = require("express");
const cors = require("cors");
const redisClient = require('./model/dbConfig');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.get('/cache-test', async (req, res) => {
    try {
      await redisClient.set('message', 'Hello from Redis!', {
        EX: 60, // expires in 60 seconds
      });
  
      const value = await redisClient.get('message');
      res.send(value);
    } catch (err) {
      console.error('Redis error:', err);
      res.status(500).send('Something went wrong');
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
