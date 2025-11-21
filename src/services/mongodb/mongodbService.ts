import { User, Company, JobPosting, Application, Course, LearningPath } from '../../models/mongodb/mongodbModel.js';
import mongoose from 'mongoose';

export class MongoDBService {  
  async createUser(userData: any) {
    const user = new User(userData);
    await user.save();
    return user;
  }

  async getUserById(userId: string) {
    return await User.findById(userId);
  }

  async getUserByEmail(email: string) {
    return await User.findOne({ email });
  }

  async getAllUsers(filters: any = {}, limit: number = 50) {
    return await User.find(filters).limit(limit);
  }

  async updateUser(userId: string, updateData: any) {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
  }

  async deleteUser(userId: string) {
    return await User.findByIdAndDelete(userId);
  }

  async addUserSkill(userId: string, skill: { name: string; level: string; yearsOfExperience?: number }) {
    return await User.findByIdAndUpdate(
      userId,
      { $push: { skills: skill } },
      { new: true }
    );
  }

  async addUserExperience(userId: string, experience: any) {
    return await User.findByIdAndUpdate(
      userId,
      { $push: { experience } },
      { new: true }
    );
  }
  
  async createCompany(companyData: any) {
    const company = new Company(companyData);
    await company.save();
    return company;
  }

  async getCompanyById(companyId: string) {
    return await Company.findById(companyId);
  }

  async getAllCompanies(filters: any = {}, limit: number = 50) {
    return await Company.find(filters).limit(limit);
  }

  async updateCompany(companyId: string, updateData: any) {
    return await Company.findByIdAndUpdate(companyId, updateData, { new: true });
  }

  async deleteCompany(companyId: string) {
    return await Company.findByIdAndDelete(companyId);
  }
  
  async createJobPosting(jobData: any) {
    const job = new JobPosting(jobData);
    await job.save();
    return job;
  }

  async getJobPostingById(jobId: string) {
    return await JobPosting.findById(jobId).populate('companyId');
  }

  async getAllJobPostings(filters: any = {}, limit: number = 50) {
    return await JobPosting.find(filters).populate('companyId').limit(limit);
  }

  async getActiveJobPostings(limit: number = 50) {
    return await JobPosting.find({ isActive: true }).populate('companyId').limit(limit);
  }

  async updateJobPosting(jobId: string, updateData: any) {
    return await JobPosting.findByIdAndUpdate(jobId, updateData, { new: true });
  }

  async deactivateJobPosting(jobId: string) {
    return await JobPosting.findByIdAndUpdate(jobId, { isActive: false }, { new: true });
  }

  async deleteJobPosting(jobId: string) {
    return await JobPosting.findByIdAndDelete(jobId);
  }

  async getJobPostingsByCompany(companyId: string) {
    return await JobPosting.find({ companyId });
  }
  
  async createApplication(applicationData: any) {
    const application = new Application(applicationData);
    await application.save();
    return application;
  }

  async getApplicationById(applicationId: string) {
    return await Application.findById(applicationId)
      .populate('userId')
      .populate('jobPostingId');
  }

  async getApplicationsByUser(userId: string) {
    return await Application.find({ userId })
      .populate('jobPostingId')
      .sort({ appliedAt: -1 });
  }

  async getApplicationsByJobPosting(jobPostingId: string) {
    return await Application.find({ jobPostingId })
      .populate('userId')
      .sort({ appliedAt: -1 });
  }

  async updateApplicationStatus(applicationId: string, status: string, rejectionReason?: string) {
    const updateData: any = { status };
    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }
    return await Application.findByIdAndUpdate(applicationId, updateData, { new: true });
  }

  async addInterview(applicationId: string, interviewData: any) {
    return await Application.findByIdAndUpdate(
      applicationId,
      { $push: { interviews: interviewData } },
      { new: true }
    );
  }

  async getUserApplicationForJob(userId: string, jobPostingId: string) {
    return await Application.findOne({ userId, jobPostingId });
  }
  
  async createCourse(courseData: any) {
    const course = new Course(courseData);
    await course.save();
    return course;
  }

  async getCourseById(courseId: string) {
    return await Course.findById(courseId);
  }

  async getAllCourses(filters: any = {}, limit: number = 50) {
    return await Course.find(filters).limit(limit);
  }

  async getCoursesByCategory(category: string) {
    return await Course.find({ category });
  }

  async updateCourse(courseId: string, updateData: any) {
    return await Course.findByIdAndUpdate(courseId, updateData, { new: true });
  }

  async deleteCourse(courseId: string) {
    return await Course.findByIdAndDelete(courseId);
  }

  
  async enrollUserInCourse(userId: string, courseId: string) {
    const learningPath = new LearningPath({
      userId,
      courseId,
      status: 'Enrolled'
    });
    await learningPath.save();
    return learningPath;
  }

  async getUserLearningPaths(userId: string) {
    return await LearningPath.find({ userId })
      .populate('courseId')
      .sort({ lastAccessedAt: -1 });
  }

  async updateLearningProgress(userId: string, courseId: string, progressData: any) {
    return await LearningPath.findOneAndUpdate(
      { userId, courseId },
      { 
        ...progressData,
        lastAccessedAt: new Date()
      },
      { new: true }
    );
  }

  async completeCourse(userId: string, courseId: string, score?: number) {
    return await LearningPath.findOneAndUpdate(
      { userId, courseId },
      {
        status: 'Completed',
        progressPercentage: 100,
        completedAt: new Date(),
        score
      },
      { new: true }
    );
  }

  async getUserCompletedCourses(userId: string) {
    return await LearningPath.find({ userId, status: 'Completed' })
      .populate('courseId');
  }

  async calculateMatchScore(userId: string, jobPostingId: string): Promise<number> {
    const user = await User.findById(userId);
    const job = await JobPosting.findById(jobPostingId);

    if (!user || !job) return 0;

    const userSkills = user.skills.map(s => s.name.toLowerCase());
    const requiredSkills = job.requiredSkills.map(s => s.toLowerCase());

    if (requiredSkills.length === 0) return 50;

    const matchingSkills = userSkills.filter(skill => requiredSkills.includes(skill));
    
    if (matchingSkills.length === 0) return 0;

    let score = (matchingSkills.length / requiredSkills.length) * 100;

    const userSkillLevels = user.skills.filter(s => matchingSkills.includes(s.name.toLowerCase()));
    
    if (userSkillLevels.length > 0) {
      const avgLevel = userSkillLevels.reduce((sum, skill) => {
        const levelScore = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 }[skill.level] || 1;
        return sum + levelScore;
      }, 0) / userSkillLevels.length;

      score += (avgLevel / 4) * 20;
    }

    return Math.min(Math.round(score), 100);
  }

  async findTopCandidatesForJob(jobPostingId: string, limit: number = 10) {
    const job = await JobPosting.findById(jobPostingId);
    if (!job) return [];

    const requiredSkills = job.requiredSkills.map(s => s.toLowerCase());

    const candidates = await User.find({
      'skills.name': { $in: job.requiredSkills }
    });

    const candidatesWithScores = await Promise.all(
      candidates.map(async (candidate: any) => {
        const candidateId = typeof candidate._id === 'object' && candidate._id?.toString
          ? candidate._id.toString()
          : String(candidate._id);

        const score = await this.calculateMatchScore(candidateId, jobPostingId);
        return {
          user: candidate,
          matchScore: score
        };
      })
    );
    

    return candidatesWithScores
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  }

  async recommendJobsForUser(userId: string, limit: number = 10) {
    const user = await User.findById(userId);
    if (!user) return [];

    const userSkills = user.skills.map(s => s.name);

    const jobs = await JobPosting.find({
      isActive: true,
      requiredSkills: { $in: userSkills }
    }).populate('companyId');

    const jobsWithScores = await Promise.all(
      jobs.map(async (job) => {
        const score = await this.calculateMatchScore(userId, (job as any)._id.toString());
        
        const existingApplication = await Application.findOne({
          userId,
          jobPostingId: job._id
        });

        return {
          job,
          matchScore: score,
          alreadyApplied: !!existingApplication
        };
      })
    );

    return jobsWithScores
      .filter(j => !j.alreadyApplied)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  }

  async getUserStats(userId: string) {
    const applications = await Application.find({ userId });
    const learningPaths = await LearningPath.find({ userId });

    return {
      totalApplications: applications.length,
      applicationsByStatus: {
        applied: applications.filter(a => a.status === 'Applied').length,
        inProgress: applications.filter(a => ['Preselection', 'Interview', 'Technical'].includes(a.status)).length,
        hired: applications.filter(a => a.status === 'Hired').length,
        rejected: applications.filter(a => a.status === 'Rejected').length
      },
      totalCourses: learningPaths.length,
      completedCourses: learningPaths.filter(lp => lp.status === 'Completed').length,
      inProgressCourses: learningPaths.filter(lp => lp.status === 'In Progress').length
    };
  }
}
