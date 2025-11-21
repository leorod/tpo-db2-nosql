import neo4j, { Driver, Session } from 'neo4j-driver';

export class Neo4jService {
  private driver: Driver;

  constructor(driver: Driver) {
    this.driver = driver;
  }

  private getSession(): Session {
    return this.driver.session();
  }
  
  async createUserNode(userId: string, userData: { name: string; email: string; location?: string }) {
    const session = this.getSession();
    try {
      const result = await session.run(
        `CREATE (u:User {id: $userId, name: $name, email: $email, location: $location, createdAt: datetime()})
         RETURN u`,
        { userId, ...userData }
      );
      return result.records[0].get('u').properties;
    } finally {
      await session.close();
    }
  }

  async getUserNode(userId: string) {
    const session = this.getSession();
    try {
      const result = await session.run(
        `MATCH (u:User {id: $userId}) RETURN u`,
        { userId }
      );
      return result.records.length > 0 ? result.records[0].get('u').properties : null;
    } finally {
      await session.close();
    }
  }
  
  async createCompanyNode(companyId: string, companyData: { name: string; industry: string }) {
    const session = this.getSession();
    try {
      const result = await session.run(
        `CREATE (c:Company {id: $companyId, name: $name, industry: $industry, createdAt: datetime()})
         RETURN c`,
        { companyId, ...companyData }
      );
      return result.records[0].get('c').properties;
    } finally {
      await session.close();
    }
  }
  
  async createSkillNode(skillName: string, category: string) {
    const session = this.getSession();
    try {
      const result = await session.run(
        `MERGE (s:Skill {name: $skillName})
         ON CREATE SET s.category = $category
         RETURN s`,
        { skillName, category }
      );
      return result.records[0].get('s').properties;
    } finally {
      await session.close();
    }
  }
  
  async createJobPostingNode(jobId: string, jobData: { title: string; location: string }) {
    const session = this.getSession();
    try {
      const result = await session.run(
        `CREATE (j:JobPosting {id: $jobId, title: $title, location: $location, createdAt: datetime()})
         RETURN j`,
        { jobId, ...jobData }
      );
      return result.records[0].get('j').properties;
    } finally {
      await session.close();
    }
  }

  
  async createCourseNode(courseId: string, courseData: { title: string; category: string }) {
    const session = this.getSession();
    try {
      const result = await session.run(
        `CREATE (c:Course {id: $courseId, title: $title, category: $category, createdAt: datetime()})
         RETURN c`,
        { courseId, ...courseData }
      );
      return result.records[0].get('c').properties;
    } finally {
      await session.close();
    }
  }
  
  async createWorksAtRelationship(userId: string, companyId: string, role: string, startDate: Date, endDate?: Date) {
    const session = this.getSession();
    try {
      const result = await session.run(
        `MATCH (u:User {id: $userId}), (c:Company {id: $companyId})
         CREATE (u)-[r:WORKS_AT {role: $role, startDate: $startDate, endDate: $endDate}]->(c)
         RETURN r`,
        { userId, companyId, role, startDate: startDate.toISOString(), endDate: endDate ? endDate.toISOString() : null }
      );
      return result.records[0].get('r').properties;
    } finally {
      await session.close();
    }
  }

  async createHasSkillRelationship(userId: string, skillName: string, level: string, yearsOfExperience?: number) {
    const session = this.getSession();
    try {
      const result = await session.run(
        `MATCH (u:User {id: $userId})
         MERGE (s:Skill {name: $skillName})
         MERGE (u)-[r:HAS_SKILL {level: $level, yearsOfExperience: $yearsOfExperience}]->(s)
         RETURN r`,
        { userId, skillName, level, yearsOfExperience }
      );
      return result.records[0].get('r').properties;
    } finally {
      await session.close();
    }
  }

  async createApplicationRelationship(userId: string, jobId: string, status: string, matchScore?: number) {
    const session = this.getSession();
    try {
      const result = await session.run(
        `MATCH (u:User {id: $userId}), (j:JobPosting {id: $jobId})
         CREATE (u)-[r:APPLIED_FOR {status: $status, matchScore: $matchScore, appliedAt: datetime()}]->(j)
         RETURN r`,
        { userId, jobId, status, matchScore }
      );
      return result.records[0].get('r').properties;
    } finally {
      await session.close();
    }
  }

  async createPostedByRelationship(companyId: string, jobId: string) {
    const session = this.getSession();
    try {
      const result = await session.run(
        `MATCH (c:Company {id: $companyId}), (j:JobPosting {id: $jobId})
         CREATE (c)-[r:POSTED]->(j)
         RETURN r`,
        { companyId, jobId }
      );
      return result.records[0].get('r').properties;
    } finally {
      await session.close();
    }
  }

  async createCourseRelationship(userId: string, courseId: string, status: 'ENROLLED_IN' | 'COMPLETED', progress?: number) {
    const session = this.getSession();
    try {
      const result = await session.run(
        `MATCH (u:User {id: $userId}), (c:Course {id: $courseId})
         CREATE (u)-[r:${status} {progress: $progress, date: datetime()}]->(c)
         RETURN r`,
        { userId, courseId, progress }
      );
      return result.records[0].get('r').properties;
    } finally {
      await session.close();
    }
  }

  async createRecommendationRelationship(fromUserId: string, toUserId: string) {
    const session = this.getSession();
    try {
      const result = await session.run(
        `MATCH (u1:User {id: $fromUserId}), (u2:User {id: $toUserId})
         MERGE (u1)-[r:RECOMMENDED_TO {createdAt: datetime()}]->(u2)
         RETURN r`,
        { fromUserId, toUserId }
      );
      return result.records[0].get('r').properties;
    } finally {
      await session.close();
    }
  }

  async createMentorRelationship(mentorId: string, menteeId: string) {
    const session = this.getSession();
    try {
      const result = await session.run(
        `MATCH (mentor:User {id: $mentorId}), (mentee:User {id: $menteeId})
         CREATE (mentor)-[r:MENTORS {startedAt: datetime()}]->(mentee)
         RETURN r`,
        { mentorId, menteeId }
      );
      return result.records[0].get('r').properties;
    } finally {
      await session.close();
    }
  }
  
  async findMatchingCandidates(jobId: string, requiredSkills: string[], limit: number = 10) {
    const session = this.getSession();
    try {
      const result = await session.run(
        `MATCH (j:JobPosting {id: $jobId})
         MATCH (u:User)-[hs:HAS_SKILL]->(s:Skill)
         WHERE s.name IN $requiredSkills
         WITH u, COUNT(DISTINCT s) as matchingSkills, COLLECT(DISTINCT s.name) as skills
         WHERE matchingSkills > 0
         RETURN u.id as userId, u.name as name, u.email as email, 
                matchingSkills, skills,
                (matchingSkills * 100.0 / $totalRequired) as matchScore
         ORDER BY matchScore DESC
         LIMIT $limit`,
        { jobId, requiredSkills, totalRequired: requiredSkills.length, limit: neo4j.int(limit) }
      );
      return result.records.map(record => ({
        userId: record.get('userId'),
        name: record.get('name'),
        email: record.get('email'),
        matchingSkills: record.get('matchingSkills').toNumber(),
        skills: record.get('skills'),
        matchScore: record.get('matchScore')
      }));
    } finally {
      await session.close();
    }
  }

  async recommendCoursesBasedOnNetwork(userId: string, limit: number = 5) {
    const session = this.getSession();
    try {
      const result = await session.run(
        `MATCH (u:User {id: $userId})-[:RECOMMENDED_TO*1..2]-(contact:User)
         MATCH (contact)-[:COMPLETED]->(c:Course)
         WHERE NOT (u)-[:COMPLETED]->(c) AND NOT (u)-[:ENROLLED_IN]->(c)
         WITH c, COUNT(DISTINCT contact) as connections
         RETURN c.id as courseId, c.title as title, c.category as category, 
                connections
         ORDER BY connections DESC
         LIMIT $limit`,
        { userId, limit: neo4j.int(limit) }
      );
      return result.records.map(record => ({
        courseId: record.get('courseId'),
        title: record.get('title'),
        category: record.get('category'),
        connections: record.get('connections').toNumber()
      }));
    } finally {
      await session.close();
    }
  }

  async getUserApplicationHistory(userId: string) {
    const session = this.getSession();
    try {
      const result = await session.run(
        `MATCH (u:User {id: $userId})-[app:APPLIED_FOR]->(j:JobPosting)<-[:POSTED]-(c:Company)
         RETURN j.title as jobTitle, c.name as companyName, 
                app.status as status, app.appliedAt as appliedAt,
                app.matchScore as matchScore
         ORDER BY app.appliedAt DESC`,
        { userId }
      );
      return result.records.map(record => ({
        jobTitle: record.get('jobTitle'),
        companyName: record.get('companyName'),
        status: record.get('status'),
        appliedAt: record.get('appliedAt'),
        matchScore: record.get('matchScore')
      }));
    } finally {
      await session.close();
    }
  }

  async findColleagues(userId: string) {
    const session = this.getSession();
    try {
      const result = await session.run(
        `MATCH (u:User {id: $userId})-[:WORKS_AT]->(c:Company)<-[:WORKS_AT]-(colleague:User)
         WHERE u <> colleague
         RETURN DISTINCT colleague.id as userId, colleague.name as name, 
                colleague.email as email, c.name as companyName`,
        { userId }
      );
      return result.records.map(record => ({
        userId: record.get('userId'),
        name: record.get('name'),
        email: record.get('email'),
        companyName: record.get('companyName')
      }));
    } finally {
      await session.close();
    }
  }

  async recommendJobsForUser(userId: string, limit: number = 10) {
    const session = this.getSession();
    try {
      const result = await session.run(
        `MATCH (u:User {id: $userId})-[:HAS_SKILL]->(s:Skill)
         WITH u, COLLECT(s.name) as userSkills
         MATCH (j:JobPosting)<-[:POSTED]-(c:Company)
         WHERE j.id IS NOT NULL
         WITH u, j, c, userSkills,
              [skill IN userSkills WHERE skill IN j.requiredSkills] as matchingSkills
         WHERE SIZE(matchingSkills) > 0
         AND NOT (u)-[:APPLIED_FOR]->(j)
         RETURN j.id as jobId, j.title as title, c.name as companyName,
                j.location as location,
                SIZE(matchingSkills) as matchCount,
                (SIZE(matchingSkills) * 100.0 / SIZE(userSkills)) as matchScore
         ORDER BY matchScore DESC
         LIMIT $limit`,
        { userId, limit: neo4j.int(limit) }
      );
      return result.records.map(record => ({
        jobId: record.get('jobId'),
        title: record.get('title'),
        companyName: record.get('companyName'),
        location: record.get('location'),
        matchCount: record.get('matchCount').toNumber(),
        matchScore: record.get('matchScore')
      }));
    } finally {
      await session.close();
    }
  }

  async updateApplicationStatus(userId: string, jobId: string, newStatus: string) {
    const session = this.getSession();
    try {
      const result = await session.run(
        `MATCH (u:User {id: $userId})-[app:APPLIED_FOR]->(j:JobPosting {id: $jobId})
         SET app.status = $newStatus, app.updatedAt = datetime()
         RETURN app`,
        { userId, jobId, newStatus }
      );
      return result.records[0].get('app').properties;
    } finally {
      await session.close();
    }
  }

  async close() {
    await this.driver.close();
  }
}
