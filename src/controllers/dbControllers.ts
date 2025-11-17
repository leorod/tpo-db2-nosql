import { Request, Response } from 'express';
import { MongoDBService } from '../services/mongodb/mongodbService.js';
import { Neo4jService } from '../services/neo4j/neoService.js';
import { RedisService } from '../services/redis/redisService.js';

export class TalentumController {
  private mongoService: MongoDBService;
  private neo4jService: Neo4jService;
  private redisService: RedisService;

  constructor(mongoService: MongoDBService, neo4jService: Neo4jService, redisService: RedisService) {
    this.mongoService = mongoService;
    this.neo4jService = neo4jService;
    this.redisService = redisService;
  }

  createUser = async (req: Request, res: Response) => {
    try {
      const userData = req.body;
      
      const user = await this.mongoService.createUser(userData);
      
      await this.neo4jService.createUserNode(user._id.toString(), {
        name: user.name,
        email: user.email,
        location: user.location
      });
      
      if (userData.skills && userData.skills.length > 0) {
        for (const skill of userData.skills) {
          await this.neo4jService.createHasSkillRelationship(
            user._id.toString(),
            skill.name,
            skill.level,
            skill.yearsOfExperience
          );
        }
      }
      
      await this.redisService.cacheUser(user._id.toString(), user.toObject());
      
      res.status(201).json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getUserById = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      
      let user = await this.redisService.getCachedUser(userId);
      
      if (!user) {
        user = await this.mongoService.getUserById(userId);
        if (user) {
          await this.redisService.cacheUser(userId, user.toObject());
        }
      }
      
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      
      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.mongoService.getAllUsers();
      res.json({ success: true, data: users });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const updateData = req.body;
      
      const user = await this.mongoService.updateUser(userId, updateData);
      
      // Invalidar caché
      await this.redisService.invalidateUserCache(userId);
      
      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getUserStats = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const stats = await this.mongoService.getUserStats(userId);
      res.json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  createCompany = async (req: Request, res: Response) => {
    try {
      const companyData = req.body;
      
      // Crear empresa en MongoDB
      const company = await this.mongoService.createCompany(companyData);
      
      // Crear nodo en Neo4j
      await this.neo4jService.createCompanyNode(company._id.toString(), {
        name: company.name,
        industry: company.industry
      });
      
      res.status(201).json({ success: true, data: company });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getAllCompanies = async (req: Request, res: Response) => {
    try {
      const companies = await this.mongoService.getAllCompanies();
      res.json({ success: true, data: companies });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  createJobPosting = async (req: Request, res: Response) => {
    try {
      const jobData = req.body;
      
      // Crear job en MongoDB
      const job = await this.mongoService.createJobPosting(jobData);
      
      // Crear nodo en Neo4j
      await this.neo4jService.createJobPostingNode(job._id.toString(), {
        title: job.title,
        location: job.location
      });
      
      // Crear relación POSTED con la empresa
      await this.neo4jService.createPostedByRelationship(
        job.companyId.toString(),
        job._id.toString()
      );
      
      // Invalidar caché de jobs activos
      await this.redisService.invalidateJobCache();
      
      res.status(201).json({ success: true, data: job });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getActiveJobPostings = async (req: Request, res: Response) => {
    try {
      // Intentar obtener de caché
      let jobs = await this.redisService.getCachedActiveJobs();
      
      if (!jobs) {
        // Si no está en caché, buscar en MongoDB
        jobs = await this.mongoService.getActiveJobPostings();
        await this.redisService.cacheActiveJobs(jobs);
      }
      
      res.json({ success: true, data: jobs });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getJobPostingById = async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      
      // Intentar obtener de caché
      let job = await this.redisService.getCachedJobPosting(jobId);
      
      if (!job) {
        job = await this.mongoService.getJobPostingById(jobId);
        if (job) {
          await this.redisService.cacheJobPosting(jobId, job);
        }
      }
      
      if (!job) {
        return res.status(404).json({ success: false, error: 'Job not found' });
      }
      
      res.json({ success: true, data: job });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  applyToJob = async (req: Request, res: Response) => {
    try {
      const { userId, jobPostingId } = req.body;
      
      // Verificar si ya aplicó
      const existingApp = await this.mongoService.getUserApplicationForJob(userId, jobPostingId);
      if (existingApp) {
        return res.status(400).json({ success: false, error: 'Already applied to this job' });
      }
      
      // Calcular match score
      const matchScore = await this.mongoService.calculateMatchScore(userId, jobPostingId);
      
      // Crear aplicación en MongoDB
      const application = await this.mongoService.createApplication({
        userId,
        jobPostingId,
        status: 'Applied',
        matchScore
      });
      
      // Crear relación en Neo4j
      await this.neo4jService.createApplicationRelationship(
        userId,
        jobPostingId,
        'Applied',
        matchScore
      );
      
      // Track en Redis
      await this.redisService.trackApplicationSubmitted(jobPostingId);
      
      // Agregar actividad reciente
      await this.redisService.addRecentActivity(userId, {
        type: 'application',
        jobId: jobPostingId,
        timestamp: new Date()
      });
      
      res.status(201).json({ success: true, data: application, matchScore });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getUserApplications = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const applications = await this.mongoService.getApplicationsByUser(userId);
      res.json({ success: true, data: applications });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getJobApplications = async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      const applications = await this.mongoService.getApplicationsByJobPosting(jobId);
      res.json({ success: true, data: applications });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  updateApplicationStatus = async (req: Request, res: Response) => {
    try {
      const { applicationId } = req.params;
      const { status, rejectionReason } = req.body;
      
      const application = await this.mongoService.updateApplicationStatus(
        applicationId,
        status,
        rejectionReason
      );
      
      // Actualizar en Neo4j también
      if (application) {
        await this.neo4jService.updateApplicationStatus(
          application.userId.toString(),
          application.jobPostingId.toString(),
          status
        );
      }
      
      res.json({ success: true, data: application });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getMatchingCandidates = async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      
      // Intentar obtener de caché
      let candidates = await this.redisService.getCachedMatchingCandidates(jobId);
      
      if (!candidates) {
        // Buscar en MongoDB
        const mongoResults = await this.mongoService.findTopCandidatesForJob(jobId, limit);
        
        // También buscar en Neo4j para enriquecer con datos de grafo
        const job = await this.mongoService.getJobPostingById(jobId);
        if (job) {
          const neo4jResults = await this.neo4jService.findMatchingCandidates(
            jobId,
            job.requiredSkills,
            limit
          );
          
          // Combinar resultados
          candidates = {
            mongoResults,
            neo4jResults
          };
          
          await this.redisService.cacheMatchingCandidates(jobId, candidates);
        }
      }
      
      res.json({ success: true, data: candidates });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getRecommendedJobs = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      
      // Intentar obtener de caché
      let recommendations = await this.redisService.getCachedRecommendedJobs(userId);
      
      if (!recommendations) {
        // Buscar en MongoDB
        const mongoJobs = await this.mongoService.recommendJobsForUser(userId, limit);
        
        // Buscar en Neo4j
        const neo4jJobs = await this.neo4jService.recommendJobsForUser(userId, limit);
        
        recommendations = {
          mongoRecommendations: mongoJobs,
          neo4jRecommendations: neo4jJobs
        };
        
        await this.redisService.cacheRecommendedJobs(userId, recommendations);
      }
      
      res.json({ success: true, data: recommendations });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  createCourse = async (req: Request, res: Response) => {
    try {
      const courseData = req.body;
      
      const course = await this.mongoService.createCourse(courseData);
      
      // Crear nodo en Neo4j
      await this.neo4jService.createCourseNode(course._id.toString(), {
        title: course.title,
        category: course.category
      });
      
      res.status(201).json({ success: true, data: course });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getAllCourses = async (req: Request, res: Response) => {
    try {
      const courses = await this.mongoService.getAllCourses();
      res.json({ success: true, data: courses });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  enrollInCourse = async (req: Request, res: Response) => {
    try {
      const { userId, courseId } = req.body;
      
      // Crear learning path en MongoDB
      const learningPath = await this.mongoService.enrollUserInCourse(userId, courseId);
      
      // Crear relación en Neo4j
      await this.neo4jService.createCourseRelationship(userId, courseId, 'ENROLLED_IN', 0);
      
      res.status(201).json({ success: true, data: learningPath });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  updateCourseProgress = async (req: Request, res: Response) => {
    try {
      const { userId, courseId } = req.params;
      const { progressPercentage, status } = req.body;
      
      const learningPath = await this.mongoService.updateLearningProgress(
        userId,
        courseId,
        { progressPercentage, status }
      );
      
      res.json({ success: true, data: learningPath });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getUserCourses = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const courses = await this.mongoService.getUserLearningPaths(userId);
      res.json({ success: true, data: courses });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getRecommendedCourses = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const limit = parseInt(req.query.limit as string) || 5;
      
      // Intentar obtener de caché
      let recommendations = await this.redisService.getCachedRecommendedCourses(userId);
      
      if (!recommendations) {
        // Buscar en Neo4j (basado en network)
        recommendations = await this.neo4jService.recommendCoursesBasedOnNetwork(userId, limit);
        await this.redisService.cacheRecommendedCourses(userId, recommendations);
      }
      
      res.json({ success: true, data: recommendations });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getColleagues = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const colleagues = await this.neo4jService.findColleagues(userId);
      res.json({ success: true, data: colleagues });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  addRecommendation = async (req: Request, res: Response) => {
    try {
      const { fromUserId, toUserId } = req.body;
      
      await this.neo4jService.createRecommendationRelationship(fromUserId, toUserId);
      
      res.json({ success: true, message: 'Recommendation created' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  createMentorship = async (req: Request, res: Response) => {
    try {
      const { mentorId, menteeId } = req.body;
      
      await this.neo4jService.createMentorRelationship(mentorId, menteeId);
      
      res.json({ success: true, message: 'Mentorship created' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getApplicationHistory = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const history = await this.neo4jService.getUserApplicationHistory(userId);
      res.json({ success: true, data: history });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getRecentActivity = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const count = parseInt(req.query.count as string) || 20;
      
      const activity = await this.redisService.getRecentActivity(userId, count);
      res.json({ success: true, data: activity });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  healthCheck = async (req: Request, res: Response) => {
    res.json({ 
      success: true, 
      message: 'Talentum+ API is running',
      timestamp: new Date()
    });
  };
}
