import mongoose from 'mongoose';
import neo4j, { Driver, SessionConfig, Session } from 'neo4j-driver';
import { createClient } from 'redis';
import dotenv from 'dotenv';
import { dbConnectionsGauge } from '../metrics.js';

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

    setInterval(() => {
      const connections = mongoose.connection.readyState === 1 
        ? mongoose.connections.length
        : 0;
      dbConnectionsGauge.labels('mongodb').set(connections);
    }, 5000);
    
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export class Neo4jTrackedDriver {
  private activeSessions: number;
  private _delegate: Driver;

  constructor(delegate: Driver) {
    this.activeSessions = 0;
    this._delegate = delegate;
  }

  public session(config?: SessionConfig): Session {
    const session = this._delegate.session(config);
    this.activeSessions++;
    dbConnectionsGauge.labels('neo4j').set(this.activeSessions);

    const originalClose = session.close.bind(session);
    session.close = async () => {
      this.activeSessions--;
      dbConnectionsGauge.labels('neo4j').set(this.activeSessions);
      return originalClose();
    };

    return session;
  }

  public async close(): Promise<void> {
    return await this._delegate.close();
  }
  
  get delegate(): Driver {
    return this._delegate;
  }
}

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
  return new Neo4jTrackedDriver(driver);
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
