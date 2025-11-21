import express from 'express';
import { connectMongoDB, connectNeo4j, connectRedis } from './config/database.js';
import { MongoDBService } from './services/mongodb/mongodbService.js';
import { Neo4jService } from './services/neo4j/neoService.js';
import { RedisService } from './services/redis/redisService.js';
import { TalentumController } from './controllers/dbControllers.js';
import { createRoutes } from './routes/routes.js';
import dotenv from 'dotenv';
import * as metrics from './metrics.js';

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

// Métricas
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const route = req.route ? `${req.baseUrl}${req.route.path}` : req.path;

    metrics.httpRequestCounter.labels(req.method, route, res.statusCode.toString()).inc();
    metrics.httpRequestDuration.labels(req.method, route, res.statusCode.toString()).observe(duration);
  });

  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', metrics.register.contentType);
  res.end(await metrics.register.metrics());
});

const initializeApp = async () => {
  try {
    console.log('🚀 Starting Talentum+ Platform...\n');

    console.log('📊 Connecting to databases...');
    await connectMongoDB();
    const neo4jDriver = connectNeo4j();
    const redisClient = await connectRedis();
    console.log('✅ All databases connected!\n');

    console.log('🔧 Initializing services...');
    const mongoService = new MongoDBService();
    const neo4jService = new Neo4jService(neo4jDriver);
    const redisService = new RedisService(redisClient);
    console.log('✅ Services initialized!\n');

    const controller = new TalentumController(mongoService, neo4jService, redisService);

    const routes = createRoutes(controller);
    app.use('/api', routes);

    console.log('🛣️  Routes configured!\n');

    app.listen(port, () => {
      console.log(`Server running on: http://localhost:${port}`);
    });

    process.on('SIGINT', async () => {
      console.log('\n⚠️  Shutting down gracefully...');
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