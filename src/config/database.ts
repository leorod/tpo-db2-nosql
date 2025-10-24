import mongoose from 'mongoose';
import { createClient } from 'redis';
import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB Connection
export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Redis Connection
export const connectRedis = async () => {
  const client = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD
  });

  client.on('error', (err) => console.error('Redis Client Error:', err));
  await client.connect();
  console.log('Redis connected successfully');
  return client;
};

// Neo4j Connection
export const connectNeo4j = () => {
  const driver = neo4j.driver(
    process.env.NEO4J_URI || 'bolt://localhost:7687',
    neo4j.auth.basic(
      process.env.NEO4J_USER || 'neo4j',
      process.env.NEO4J_PASSWORD || 'password'
    )
  );
  console.log('Neo4j connected successfully');
  return driver;
};
