import { createClient } from 'redis';

type RedisClientType = ReturnType<typeof createClient>;

export class RedisService {
  private client: RedisClientType;
  private readonly DEFAULT_TTL = 3600;

  constructor(client: RedisClientType) {
    this.client = client;
  }

  async set(key: string, value: any, ttl: number = this.DEFAULT_TTL): Promise<void> {
    const stringValue = JSON.stringify(value);
    await this.client.setEx(key, ttl, stringValue);
  }

  async get(key: string): Promise<any | null> {
    const value = await this.client.get(key);
    if (!value) return null;
    
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async deletePattern(pattern: string): Promise<void> {
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) {
      await this.client.del(keys);
    }
  }

  async cacheUser(userId: string, userData: any, ttl: number = 1800): Promise<void> {
    await this.set(`user:${userId}`, userData, ttl);
  }

  async getCachedUser(userId: string): Promise<any | null> {
    return await this.get(`user:${userId}`);
  }

  async invalidateUserCache(userId: string): Promise<void> {
    await this.delete(`user:${userId}`);
  }


  async cacheJobPosting(jobId: string, jobData: any, ttl: number = 3600): Promise<void> {
    await this.set(`job:${jobId}`, jobData, ttl);
  }

  async getCachedJobPosting(jobId: string): Promise<any | null> {
    return await this.get(`job:${jobId}`);
  }

  async cacheActiveJobs(jobs: any[], ttl: number = 600): Promise<void> {
    await this.set('jobs:active', jobs, ttl);
  }

  async getCachedActiveJobs(): Promise<any[] | null> {
    return await this.get('jobs:active');
  }

  async invalidateJobCache(jobId?: string): Promise<void> {
    if (jobId) {
      await this.delete(`job:${jobId}`);
    }
    await this.delete('jobs:active');
  }

  async cacheMatchingCandidates(jobId: string, candidates: any[], ttl: number = 1800): Promise<void> {
    await this.set(`match:job:${jobId}`, candidates, ttl);
  }

  async getCachedMatchingCandidates(jobId: string): Promise<any[] | null> {
    return await this.get(`match:job:${jobId}`);
  }

  async cacheRecommendedJobs(userId: string, jobs: any[], ttl: number = 1800): Promise<void> {
    await this.set(`recommendations:user:${userId}`, jobs, ttl);
  }

  async getCachedRecommendedJobs(userId: string): Promise<any[] | null> {
    return await this.get(`recommendations:user:${userId}`);
  }

  async invalidateMatchingCache(jobId?: string, userId?: string): Promise<void> {
    if (jobId) {
      await this.delete(`match:job:${jobId}`);
    }
    if (userId) {
      await this.delete(`recommendations:user:${userId}`);
    }
  }

  async cacheCourse(courseId: string, courseData: any, ttl: number = 7200): Promise<void> {
    await this.set(`course:${courseId}`, courseData, ttl);
  }

  async getCachedCourse(courseId: string): Promise<any | null> {
    return await this.get(`course:${courseId}`);
  }

  async cacheRecommendedCourses(userId: string, courses: any[], ttl: number = 3600): Promise<void> {
    await this.set(`course:recommendations:${userId}`, courses, ttl);
  }

  async getCachedRecommendedCourses(userId: string): Promise<any[] | null> {
    return await this.get(`course:recommendations:${userId}`);
  }

  async cacheAllCourses(courses: any[], ttl: number = 3600): Promise<void> {
    await this.set('courses:all', courses, ttl);
  }

  async getCachedAllCourses(): Promise<any[] | null> {
    return await this.get('courses:all');
  }

  async invalidateCourseCache(courseId?: string): Promise<void> {
    if (courseId) {
      await this.delete(`course:${courseId}`);
    }
    await this.delete('courses:all');
  }

  async cacheAllCompanies(companies: any[], ttl: number = 3600): Promise<void> {
    await this.set('companies:all', companies, ttl);
  }

  async getCachedAllCompanies(): Promise<any[] | null> {
    return await this.get('companies:all');
  }

  async invalidateCompanyCache(): Promise<void> {
    await this.delete('companies:all');
  }

  async cacheUserStats(userId: string, stats: any, ttl: number = 1800): Promise<void> {
    await this.set(`user:${userId}:stats`, stats, ttl);
  }

  async getCachedUserStats(userId: string): Promise<any | null> {
    return await this.get(`user:${userId}:stats`);
  }

  async invalidateUserStats(userId: string): Promise<void> {
    await this.delete(`user:${userId}:stats`);
  }

  async cacheUserApplications(userId: string, applications: any[], ttl: number = 300): Promise<void> {
    await this.set(`applications:user:${userId}`, applications, ttl);
  }

  async getCachedUserApplications(userId: string): Promise<any[] | null> {
    return await this.get(`applications:user:${userId}`);
  }

  async cacheJobApplications(jobId: string, applications: any[], ttl: number = 300): Promise<void> {
    await this.set(`applications:job:${jobId}`, applications, ttl);
  }

  async getCachedJobApplications(jobId: string): Promise<any[] | null> {
    return await this.get(`applications:job:${jobId}`);
  }

  async invalidateApplicationsCache(userId?: string, jobId?: string): Promise<void> {
    if (userId) {
      await this.delete(`applications:user:${userId}`);
      await this.delete(`user:${userId}:stats`);
    }
    if (jobId) {
      await this.delete(`applications:job:${jobId}`);
    }
  }

  async cacheUserCourses(userId: string, courses: any[], ttl: number = 600): Promise<void> {
    await this.set(`courses:user:${userId}`, courses, ttl);
  }

  async getCachedUserCourses(userId: string): Promise<any[] | null> {
    return await this.get(`courses:user:${userId}`);
  }

  async invalidateUserCourses(userId: string): Promise<void> {
    await this.delete(`courses:user:${userId}`);
  }

  async createSession(sessionId: string, userData: any, ttl: number = 86400): Promise<void> {
    await this.set(`session:${sessionId}`, userData, ttl);
  }

  async getSession(sessionId: string): Promise<any | null> {
    return await this.get(`session:${sessionId}`);
  }

  async updateSession(sessionId: string, userData: any, ttl: number = 86400): Promise<void> {
    await this.set(`session:${sessionId}`, userData, ttl);
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.delete(`session:${sessionId}`);
  }

  async refreshSession(sessionId: string, ttl: number = 86400): Promise<boolean> {
    const sessionData = await this.getSession(sessionId);
    if (!sessionData) return false;
    
    await this.updateSession(sessionId, sessionData, ttl);
    return true;
  }

  async incrementRateLimit(identifier: string, window: number = 60): Promise<number> {
    const key = `ratelimit:${identifier}`;
    const current = await this.client.incr(key);
    
    if (current === 1) {
      await this.client.expire(key, window);
    }
    
    return current;
  }

  async checkRateLimit(identifier: string, limit: number): Promise<boolean> {
    const key = `ratelimit:${identifier}`;
    const current = await this.get(key);
    return current ? parseInt(current) <= limit : true;
  }

  async getRemainingRequests(identifier: string, limit: number): Promise<number> {
    const key = `ratelimit:${identifier}`;
    const current = await this.get(key);
    const used = current ? parseInt(current) : 0;
    return Math.max(0, limit - used);
  }

  async incrementCounter(key: string): Promise<number> {
    return await this.client.incr(`counter:${key}`);
  }

  async getCounter(key: string): Promise<number> {
    const value = await this.get(`counter:${key}`);
    return value ? parseInt(value) : 0;
  }

  async setCounter(key: string, value: number): Promise<void> {
    await this.client.set(`counter:${key}`, value.toString());
  }

  async trackApplicationSubmitted(jobId: string): Promise<void> {
    await this.incrementCounter(`job:${jobId}:applications`);
    await this.incrementCounter('applications:total:today');
  }

  async getJobApplicationCount(jobId: string): Promise<number> {
    return await this.getCounter(`job:${jobId}:applications`);
  }

  async addRecentActivity(userId: string, activity: any, maxItems: number = 50): Promise<void> {
    const key = `activity:${userId}`;
    await this.client.lPush(key, JSON.stringify(activity));
    await this.client.lTrim(key, 0, maxItems - 1);
    await this.client.expire(key, 604800); // 7 días
  }

  async getRecentActivity(userId: string, count: number = 20): Promise<any[]> {
    const key = `activity:${userId}`;
    const activities = await this.client.lRange(key, 0, count - 1);
    return activities.map(a => JSON.parse(a));
  }

  async addToLeaderboard(leaderboardName: string, userId: string, score: number): Promise<void> {
    await this.client.zAdd(`leaderboard:${leaderboardName}`, {
      score,
      value: userId
    });
  }

  async getTopFromLeaderboard(leaderboardName: string, count: number = 10): Promise<any[]> {
    const results = await this.client.zRangeWithScores(
      `leaderboard:${leaderboardName}`,
      0,
      count - 1,
      { REV: true }
    );
    return results.map(r => ({ userId: r.value, score: r.score }));
  }

  async getUserRank(leaderboardName: string, userId: string): Promise<number | null> {
    const rank = await this.client.zRevRank(`leaderboard:${leaderboardName}`, userId);
    return rank !== null ? rank + 1 : null;
  }


  async flushAll(): Promise<void> {
    await this.client.flushAll();
  }

  async close(): Promise<void> {
    await this.client.quit();
  }
}
