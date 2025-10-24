import express from 'express';
import { connectMongoDB, connectRedis, connectNeo4j } from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Connect to databases
connectMongoDB();
const redisClient = await connectRedis();
const neo4jDriver = connectNeo4j();

// Basic route
app.get('/', (req, res) => {
  res.send('Multi-Database API is running');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});