import mongoose from 'mongoose';
import neo4j from 'neo4j-driver';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

export const connectMongoDB = async () => {
  try {
    let mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      const mongoDb = process.env.MONGO_DB || 'talentum_db';
      
      if (process.env.MONGO_ROOT_USER && process.env.MONGO_ROOT_PASSWORD) {
        const mongoUser = process.env.MONGO_ROOT_USER;
        const mongoPassword = process.env.MONGO_ROOT_PASSWORD;
        mongoURI = `mongodb://${mongoUser}:${mongoPassword}@localhost:27017/${mongoDb}?authSource=admin`;
      } else {
        mongoURI = `mongodb://localhost:27017/${mongoDb}`;
      }
    }
    
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
