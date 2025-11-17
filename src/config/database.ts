import mongoose from 'mongoose';
import neo4j from 'neo4j-driver';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB Connection
export const connectMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mi_database';
    
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};


// Neo4j Connection
export const connectNeo4j = () => {
  const neo4jURI = process.env.NEO4J_URI || 'bolt://localhost:7687';
  const neo4jUser = process.env.NEO4J_USER || 'neo4j';
  const neo4jPassword = process.env.NEO4J_PASSWORD || 'db2passwordsecure!';
  
  const driver = neo4j.driver(
    neo4jURI,
    neo4j.auth.basic(neo4jUser, neo4jPassword)
  );
  console.log('Neo4j connected successfully');
  return driver;
};


// Redis Connection
export const connectRedis = async () => {
  const redisURI = process.env.REDIS_URI || 'redis://localhost:6379';
  
  const client = createClient({
    url: redisURI
  });

  client.on('error', (err) => console.error('Redis Client Error:', err));
  client.on('connect', () => console.log('Redis connected successfully'));

  await client.connect();
  return client;
};
