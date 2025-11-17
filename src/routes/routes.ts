import { Router } from 'express';
import { TalentumController } from '../controllers/dbControllers.js';

export const createRoutes = (controller: TalentumController): Router => {
  const router = Router();

  router.get('/', controller.healthCheck);
  router.get('/health', controller.healthCheck);

  router.post('/users', controller.createUser);
  router.get('/users', controller.getAllUsers);
  router.get('/users/:userId', controller.getUserById);
  router.put('/users/:userId', controller.updateUser);
  router.get('/users/:userId/stats', controller.getUserStats);

  router.post('/companies', controller.createCompany);
  router.get('/companies', controller.getAllCompanies);

  router.post('/jobs', controller.createJobPosting);
  router.get('/jobs', controller.getActiveJobPostings);
  router.get('/jobs/:jobId', controller.getJobPostingById);

  router.post('/applications', controller.applyToJob);
  router.get('/applications/user/:userId', controller.getUserApplications);
  router.get('/applications/job/:jobId', controller.getJobApplications);
  router.put('/applications/:applicationId/status', controller.updateApplicationStatus);

  router.get('/matching/job/:jobId/candidates', controller.getMatchingCandidates);
  router.get('/recommendations/user/:userId/jobs', controller.getRecommendedJobs);
  router.get('/recommendations/user/:userId/courses', controller.getRecommendedCourses);

  router.post('/courses', controller.createCourse);
  router.get('/courses', controller.getAllCourses);
  router.post('/courses/enroll', controller.enrollInCourse);
  router.put('/courses/:userId/:courseId/progress', controller.updateCourseProgress);
  router.get('/courses/user/:userId', controller.getUserCourses);

  router.get('/network/:userId/colleagues', controller.getColleagues);
  router.post('/network/recommend', controller.addRecommendation);
  router.post('/network/mentorship', controller.createMentorship);

  router.get('/analytics/user/:userId/history', controller.getApplicationHistory);
  router.get('/analytics/user/:userId/activity', controller.getRecentActivity);

  return router;
};
