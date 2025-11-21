import express from 'express';
import { connectMongoDB, connectNeo4j, connectRedis } from './config/database.js';
import { MongoDBService } from './services/mongodb/mongodbService.js';
import { Neo4jService } from './services/neo4j/neoService.js';
import { RedisService } from './services/redis/redisService.js';
import { TalentumController } from './controllers/dbControllers.js';
import { createRoutes } from './routes/routes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

const initializeApp = async () => {
  try {
    console.log('🚀 Starting Talentum+ Platform...\n');

    await connectMongoDB();
    const neo4jDriver = connectNeo4j();
    const redisClient = await connectRedis();
    console.log('✅ All databases connected!\n');

    const mongoService = new MongoDBService();
    const neo4jService = new Neo4jService(neo4jDriver);
    const redisService = new RedisService(redisClient);

    const controller = new TalentumController(mongoService, neo4jService, redisService);

    const routes = createRoutes(controller);
    app.use('/api', routes);

    app.listen(port, () => {
      console.log(`Server running on: http://localhost:${port}`);
    });

    process.on('SIGINT', async () => {
      await neo4jService.close();
      await redisService.close();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to initialize application:', error);
    process.exit(1);
  }
};

initializeApp();