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

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware (opcional pero útil)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Initialize connections and services
const initializeApp = async () => {
  try {
    console.log('🚀 Starting Talentum+ Platform...\n');

    // Connect to databases
    console.log('📊 Connecting to databases...');
    await connectMongoDB();
    const neo4jDriver = connectNeo4j();
    const redisClient = await connectRedis();
    console.log('✅ All databases connected!\n');

    // Initialize services
    console.log('🔧 Initializing services...');
    const mongoService = new MongoDBService();
    const neo4jService = new Neo4jService(neo4jDriver);
    const redisService = new RedisService(redisClient);
    console.log('✅ Services initialized!\n');

    // Initialize controller
    const controller = new TalentumController(mongoService, neo4jService, redisService);

    // Setup routes
    const routes = createRoutes(controller);
    app.use('/api', routes);

    console.log('🛣️  Routes configured!\n');

    // Start server
    app.listen(port, () => {
      console.log('═══════════════════════════════════════════════════');
      console.log(`🎯 Talentum+ API Server`);
      console.log(`📍 Server running on: http://localhost:${port}`);
      console.log(`📡 API Endpoints: http://localhost:${port}/api`);
      console.log('═══════════════════════════════════════════════════\n');
      console.log('📚 Available endpoints:');
      console.log('   - GET  /api/health');
      console.log('   - POST /api/users');
      console.log('   - GET  /api/users');
      console.log('   - POST /api/companies');
      console.log('   - POST /api/jobs');
      console.log('   - GET  /api/jobs');
      console.log('   - POST /api/applications');
      console.log('   - GET  /api/matching/job/:jobId/candidates');
      console.log('   - GET  /api/recommendations/user/:userId/jobs');
      console.log('   - POST /api/courses');
      console.log('   - GET  /api/courses');
      console.log('   - And many more...\n');
    });

    // Graceful shutdown
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