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
      const userId = (user as any)._id.toString();
      
      await this.neo4jService.createUserNode(userId, {
        name: user.name,
        email: user.email,
        location: user.location
      });
      
      if (userData.skills && userData.skills.length > 0) {
        for (const skill of userData.skills) {
          await this.neo4jService.createHasSkillRelationship(
            userId,
            skill.name,
            skill.level,
            skill.yearsOfExperience
          );
        }
      }
      
      await this.redisService.cacheUser(userId, (user as any).toObject());
      
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
      
      await this.redisService.invalidateUserCache(userId);
      await this.redisService.invalidateUserStats(userId);
      
      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getUserStats = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      
      let stats = await this.redisService.getCachedUserStats(userId);
      
      if (!stats) {
        stats = await this.mongoService.getUserStats(userId);
        await this.redisService.cacheUserStats(userId, stats);
      }
      
      res.json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  createCompany = async (req: Request, res: Response) => {
    try {
      const companyData = req.body;
      
      const company = await this.mongoService.createCompany(companyData);
      
      await this.neo4jService.createCompanyNode((company as any)._id.toString(), {
        name: company.name,
        industry: company.industry
      });
      
      await this.redisService.invalidateCompanyCache();
      
      res.status(201).json({ success: true, data: company });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getAllCompanies = async (req: Request, res: Response) => {
    try {
      let companies = await this.redisService.getCachedAllCompanies();
      
      if (!companies) {
        companies = await this.mongoService.getAllCompanies();
        await this.redisService.cacheAllCompanies(companies);
      }
      
      res.json({ success: true, data: companies });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  createJobPosting = async (req: Request, res: Response) => {
    try {
      const jobData = req.body;
      
      const job = await this.mongoService.createJobPosting(jobData);
      
      await this.neo4jService.createJobPostingNode((job as any)._id.toString(), {
        title: job.title,
        location: job.location
      });
      
      await this.neo4jService.createPostedByRelationship(
        (job as any).companyId.toString(),
        (job as any)._id.toString()
      );
      
      await this.redisService.invalidateJobCache();
      
      res.status(201).json({ success: true, data: job });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getActiveJobPostings = async (req: Request, res: Response) => {
    try {
      let jobs = await this.redisService.getCachedActiveJobs();
      
      if (!jobs) {
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
      
      const existingApp = await this.mongoService.getUserApplicationForJob(userId, jobPostingId);
      if (existingApp) {
        return res.status(400).json({ success: false, error: 'Already applied to this job' });
      }
      
      const matchScore = await this.mongoService.calculateMatchScore(userId, jobPostingId);
      
      const application = await this.mongoService.createApplication({
        userId,
        jobPostingId,
        status: 'Applied',
        matchScore
      });
      
      await this.neo4jService.createApplicationRelationship(
        userId,
        jobPostingId,
        'Applied',
        matchScore
      );
      
      await this.redisService.trackApplicationSubmitted(jobPostingId);
      
      await this.redisService.addRecentActivity(userId, {
        type: 'application',
        jobId: jobPostingId,
        timestamp: new Date()
      });
      
      await this.redisService.invalidateApplicationsCache(userId, jobPostingId);
      
      res.status(201).json({ success: true, data: application, matchScore });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getUserApplications = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      
      let applications = await this.redisService.getCachedUserApplications(userId);
      
      if (!applications) {
        applications = await this.mongoService.getApplicationsByUser(userId);
        await this.redisService.cacheUserApplications(userId, applications);
      }
      
      res.json({ success: true, data: applications });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getJobApplications = async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      
      let applications = await this.redisService.getCachedJobApplications(jobId);
      
      if (!applications) {
        applications = await this.mongoService.getApplicationsByJobPosting(jobId);
        await this.redisService.cacheJobApplications(jobId, applications);
      }
      
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
      
      if (application) {
        await this.neo4jService.updateApplicationStatus(
          application.userId.toString(),
          application.jobPostingId.toString(),
          status
        );
        
        await this.redisService.invalidateApplicationsCache(
          application.userId.toString(),
          application.jobPostingId.toString()
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
      
      let candidates = await this.redisService.getCachedMatchingCandidates(jobId);
      
      if (!candidates) {  
        const mongoResults = await this.mongoService.findTopCandidatesForJob(jobId, limit);
        
        const job = await this.mongoService.getJobPostingById(jobId);
        if (job) {
          const neo4jResults = await this.neo4jService.findMatchingCandidates(
            jobId,
            job.requiredSkills,
            limit
          );
          
        const combinedResults: any = {
          mongoResults,
          neo4jResults
        };
        candidates = combinedResults;
        
        await this.redisService.cacheMatchingCandidates(jobId, combinedResults);
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
      
      let recommendations = await this.redisService.getCachedRecommendedJobs(userId);
      
      if (!recommendations) {
        const mongoJobs = await this.mongoService.recommendJobsForUser(userId, limit);
        
        const neo4jJobs = await this.neo4jService.recommendJobsForUser(userId, limit);
        
        const combinedRecs: any = {
          mongoRecommendations: mongoJobs,
          neo4jRecommendations: neo4jJobs
        };
        recommendations = combinedRecs;
        
        await this.redisService.cacheRecommendedJobs(userId, combinedRecs);
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
      
      await this.neo4jService.createCourseNode((course as any)._id.toString(), {
        title: course.title,
        category: course.category
      });
      
      await this.redisService.invalidateCourseCache();
      
      res.status(201).json({ success: true, data: course });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getAllCourses = async (req: Request, res: Response) => {
    try {
      let courses = await this.redisService.getCachedAllCourses();
      
      if (!courses) {
        courses = await this.mongoService.getAllCourses();
        await this.redisService.cacheAllCourses(courses);
      }
      
      res.json({ success: true, data: courses });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  enrollInCourse = async (req: Request, res: Response) => {
    try {
      const { userId, courseId } = req.body;

      const learningPath = await this.mongoService.enrollUserInCourse(userId, courseId);
      
      await this.neo4jService.createCourseRelationship(userId, courseId, 'ENROLLED_IN', 0);
      
      await this.redisService.invalidateUserCourses(userId);
      
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
      
      await this.redisService.invalidateUserCourses(userId);
      
      res.json({ success: true, data: learningPath });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getUserCourses = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      
      let courses = await this.redisService.getCachedUserCourses(userId);
      
      if (!courses) {
        courses = await this.mongoService.getUserLearningPaths(userId);
        await this.redisService.cacheUserCourses(userId, courses);
      }
      
      res.json({ success: true, data: courses });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getRecommendedCourses = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const limit = parseInt(req.query.limit as string) || 5;
      
      let recommendations = await this.redisService.getCachedRecommendedCourses(userId);
      
      if (!recommendations) {
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

  // ============= INTERVIEW CONTROLLERS =============

  addInterview = async (req: Request, res: Response) => {
    try {
      const { applicationId } = req.params;
      const interviewData = req.body;
      
      const application = await this.mongoService.addInterviewToApplication(applicationId, interviewData);
      
      await this.redisService.invalidateApplicationsCache(
        application.userId.toString(),
        application.jobPostingId.toString()
      );
      
      res.status(201).json({ success: true, data: application });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getInterviews = async (req: Request, res: Response) => {
    try {
      const { applicationId } = req.params;
      
      const result = await this.mongoService.getApplicationInterviews(applicationId);
      
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  updateInterview = async (req: Request, res: Response) => {
    try {
      const { applicationId, interviewIndex } = req.params;
      const updates = req.body;
      
      const application = await this.mongoService.updateInterviewFeedback(
        applicationId,
        parseInt(interviewIndex),
        updates
      );
      
      await this.redisService.invalidateApplicationsCache(
        application.userId.toString(),
        application.jobPostingId.toString()
      );
      
      res.json({ success: true, data: application });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  // ============= COURSE SCORE CONTROLLERS =============

  updateCourseScore = async (req: Request, res: Response) => {
    try {
      const { userId, courseId } = req.params;
      const { score } = req.body;
      
      if (score === undefined || score === null) {
        return res.status(400).json({ success: false, error: 'Score is required' });
      }
      
      const learningPath = await this.mongoService.updateCourseScore(userId, courseId, score);
      
      await this.redisService.invalidateUserCourses(userId);
      await this.redisService.invalidateUserStats(userId);
      
      res.json({ success: true, data: learningPath });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getUserCourseScores = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      
      const scores = await this.mongoService.getUserCourseScores(userId);
      
      res.json({ success: true, data: scores });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  // ============= CERTIFICATION CONTROLLERS =============

  createCertification = async (req: Request, res: Response) => {
    try {
      const certificationData = req.body;
      
      const certification = await this.mongoService.createCertification(certificationData);
      
      await this.redisService.invalidateUserCache(certificationData.userId);
      await this.redisService.invalidateUserStats(certificationData.userId);
      
      res.status(201).json({ success: true, data: certification });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getUserCertifications = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      
      const certifications = await this.mongoService.getUserCertifications(userId);
      
      res.json({ success: true, data: certifications });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getCertificationById = async (req: Request, res: Response) => {
    try {
      const { certificationId } = req.params;
      
      const certification = await this.mongoService.getCertificationById(certificationId);
      
      if (!certification) {
        return res.status(404).json({ success: false, error: 'Certification not found' });
      }
      
      res.json({ success: true, data: certification });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  updateCertification = async (req: Request, res: Response) => {
    try {
      const { certificationId } = req.params;
      const updateData = req.body;
      
      const certification = await this.mongoService.updateCertification(certificationId, updateData);
      
      if (!certification) {
        return res.status(404).json({ success: false, error: 'Certification not found' });
      }
      
      await this.redisService.invalidateUserCache((certification as any).userId.toString());
      
      res.json({ success: true, data: certification });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  deleteCertification = async (req: Request, res: Response) => {
    try {
      const { certificationId } = req.params;
      
      const certification = await this.mongoService.deleteCertification(certificationId);
      
      if (!certification) {
        return res.status(404).json({ success: false, error: 'Certification not found' });
      }
      
      await this.redisService.invalidateUserCache((certification as any).userId.toString());
      
      res.json({ success: true, message: 'Certification deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getActiveCertifications = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      
      const certifications = await this.mongoService.getActiveCertifications(userId);
      
      res.json({ success: true, data: certifications });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getCertificationsBySkill = async (req: Request, res: Response) => {
    try {
      const { skill } = req.params;
      
      const certifications = await this.mongoService.getCertificationsBySkill(skill);
      
      res.json({ success: true, data: certifications });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
}
