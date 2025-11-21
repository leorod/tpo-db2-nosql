// Script para poblar la base de datos con datos de ejemplo
import { connectMongoDB, connectNeo4j, connectRedis } from '../config/database.js';
import { MongoDBService } from '../services/mongodb/mongodbService.js';
import { Neo4jService } from '../services/neo4j/neoService.js';
import { RedisService } from '../services/redis/redisService.js';

const seedDatabase = async () => {
  console.log('🌱 Iniciando seed de la base de datos...\n');

  try {
    await connectMongoDB();
    const neo4jDriver = connectNeo4j();
    const redisClient = await connectRedis();

    const mongoService = new MongoDBService();
    const neo4jService = new Neo4jService(neo4jDriver);
    
    console.log('📊 Creando empresas...');
    
    const companies = await Promise.all([
      mongoService.createCompany({
        name: 'TechCorp Solutions',
        industry: 'Technology',
        description: 'Empresa líder en desarrollo de software',
        website: 'https://techcorp.com',
        foundedYear: 2015,
        size: '200-500',
        location: 'Buenos Aires, Argentina'
      }),
      mongoService.createCompany({
        name: 'DataScience Labs',
        industry: 'Data Analytics',
        description: 'Especialistas en Big Data y Machine Learning',
        website: 'https://datasciencelab.com',
        foundedYear: 2018,
        size: '50-200',
        location: 'Córdoba, Argentina'
      }),
      mongoService.createCompany({
        name: 'FinTech Innovations',
        industry: 'Finance',
        description: 'Soluciones fintech de última generación',
        website: 'https://fintechinno.com',
        foundedYear: 2020,
        size: '10-50',
        location: 'Buenos Aires, Argentina'
      })
    ]);

    for (const company of companies) {
      await neo4jService.createCompanyNode(company.id.toString(), {
        name: company.name,
        industry: company.industry
      });
    }

    const users = await Promise.all([
      mongoService.createUser({
        name: 'Juan Pérez',
        email: 'juan.perez@example.com',
        phone: '+54 11 1234-5678',
        location: 'Buenos Aires, Argentina',
        bio: 'Full-stack developer apasionado por React y Node.js',
        currentRole: 'Senior Developer',
        isEmployee: false,
        skills: [
          { name: 'JavaScript', level: 'Expert', yearsOfExperience: 7 },
          { name: 'React', level: 'Expert', yearsOfExperience: 5 },
          { name: 'Node.js', level: 'Advanced', yearsOfExperience: 6 },
          { name: 'MongoDB', level: 'Advanced', yearsOfExperience: 4 },
          { name: 'TypeScript', level: 'Advanced', yearsOfExperience: 4 }
        ],
        experience: [
          {
            company: 'TechCorp Solutions',
            role: 'Senior Developer',
            startDate: new Date('2020-01-15'),
            description: 'Desarrollo de aplicaciones web full-stack'
          }
        ],
        education: [
          {
            institution: 'UADE',
            degree: 'Licenciatura',
            field: 'Ingeniería en Sistemas',
            graduationYear: 2019
          }
        ]
      }),
      mongoService.createUser({
        name: 'María González',
        email: 'maria.gonzalez@example.com',
        location: 'Córdoba, Argentina',
        bio: 'Data Scientist con experiencia en ML y AI',
        currentRole: 'Data Scientist',
        isEmployee: true,
        skills: [
          { name: 'Python', level: 'Expert', yearsOfExperience: 6 },
          { name: 'Machine Learning', level: 'Advanced', yearsOfExperience: 4 },
          { name: 'SQL', level: 'Advanced', yearsOfExperience: 5 },
          { name: 'TensorFlow', level: 'Intermediate', yearsOfExperience: 3 },
          { name: 'Pandas', level: 'Advanced', yearsOfExperience: 5 }
        ],
        experience: [
          {
            company: 'DataScience Labs',
            role: 'Data Scientist',
            startDate: new Date('2019-03-01'),
            description: 'Desarrollo de modelos de ML'
          }
        ],
        education: [
          {
            institution: 'UBA',
            degree: 'Maestría',
            field: 'Ciencia de Datos',
            graduationYear: 2018
          }
        ]
      }),
      mongoService.createUser({
        name: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@example.com',
        location: 'Buenos Aires, Argentina',
        bio: 'Backend developer especializado en arquitecturas de microservicios',
        currentRole: 'Backend Developer',
        isEmployee: false,
        skills: [
          { name: 'Java', level: 'Expert', yearsOfExperience: 8 },
          { name: 'Spring Boot', level: 'Expert', yearsOfExperience: 6 },
          { name: 'Docker', level: 'Advanced', yearsOfExperience: 4 },
          { name: 'Kubernetes', level: 'Intermediate', yearsOfExperience: 3 },
          { name: 'PostgreSQL', level: 'Advanced', yearsOfExperience: 7 }
        ],
        experience: [
          {
            company: 'TechCorp Solutions',
            role: 'Backend Developer',
            startDate: new Date('2018-06-01'),
            endDate: new Date('2022-12-31'),
            description: 'Arquitectura de microservicios'
          }
        ],
        education: [
          {
            institution: 'UTN',
            degree: 'Ingeniería',
            field: 'Sistemas de Información',
            graduationYear: 2016
          }
        ]
      })
    ]);

    for (const user of users) {
      await neo4jService.createUserNode(user.id.toString(), {
        name: user.name,
        email: user.email,
        location: user.location
      });

      for (const skill of user.skills) {
        await neo4jService.createHasSkillRelationship(
          user.id.toString(),
          skill.name,
          skill.level,
          skill.yearsOfExperience
        );
      }

      for (const exp of user.experience) {
        const company = companies.find(c => c.name === exp.company);
        if (company) {
          await neo4jService.createWorksAtRelationship(
            user.id.toString(),
            company.id.toString(),
            exp.role,
            exp.startDate,
            exp.endDate
          );
        }
      }
    }


    const jobs = await Promise.all([
      mongoService.createJobPosting({
        title: 'Senior Full-Stack Developer',
        companyId: companies[0]._id,
        description: 'Buscamos un desarrollador full-stack senior con experiencia en React y Node.js',
        requirements: [
          '5+ años de experiencia',
          'React y Node.js',
          'MongoDB o similares',
          'Trabajo en equipo'
        ],
        location: 'Buenos Aires, Argentina (Híbrido)',
        salaryRange: { min: 3500, max: 5500, currency: 'USD' },
        type: 'Full-time',
        level: 'Senior',
        requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        isActive: true
      }),
      mongoService.createJobPosting({
        title: 'Data Scientist',
        companyId: companies[1]._id,
        description: 'Buscamos Data Scientist para proyectos de ML',
        requirements: [
          'Experiencia en Python',
          'ML y estadística',
          'SQL avanzado'
        ],
        location: 'Córdoba, Argentina (Remoto)',
        salaryRange: { min: 3000, max: 5000, currency: 'USD' },
        type: 'Full-time',
        level: 'Mid',
        requiredSkills: ['Python', 'Machine Learning', 'SQL'],
        isActive: true
      }),
      mongoService.createJobPosting({
        title: 'Backend Developer - Java',
        companyId: companies[2]._id,
        description: 'Desarrollador backend con experiencia en Java y Spring Boot',
        requirements: [
          'Java y Spring Boot',
          'Microservicios',
          'Docker/Kubernetes'
        ],
        location: 'Buenos Aires, Argentina',
        salaryRange: { min: 3000, max: 4500, currency: 'USD' },
        type: 'Full-time',
        level: 'Senior',
        requiredSkills: ['Java', 'Spring Boot', 'Docker', 'PostgreSQL'],
        isActive: true
      })
    ]);

    for (const job of jobs) {
      await neo4jService.createJobPostingNode(job.id.toString(), {
        title: job.title,
        location: job.location
      });

      await neo4jService.createPostedByRelationship(
        job.companyId.toString(),
        job.id.toString()
      );
    }

    const courses = await Promise.all([
      mongoService.createCourse({
        title: 'React Avanzado: Hooks y Context API',
        description: 'Aprende los conceptos avanzados de React',
        category: 'Frontend Development',
        difficulty: 'Advanced',
        duration: 20,
        url: 'https://platform.com/courses/react-advanced',
        materials: [
          { type: 'Video', title: 'Introducción a Hooks', url: 'https://example.com/video1' },
          { type: 'PDF', title: 'Guía de Context API', url: 'https://example.com/pdf1' }
        ],
        skills: ['React', 'JavaScript']
      }),
      mongoService.createCourse({
        title: 'Machine Learning con Python',
        description: 'Curso completo de ML desde cero',
        category: 'Data Science',
        difficulty: 'Intermediate',
        duration: 40,
        url: 'https://platform.com/courses/ml-python',
        materials: [
          { type: 'Video', title: 'Introducción a ML', url: 'https://example.com/video2' }
        ],
        skills: ['Python', 'Machine Learning', 'Pandas']
      }),
      mongoService.createCourse({
        title: 'Microservicios con Spring Boot',
        description: 'Arquitectura de microservicios moderna',
        category: 'Backend Development',
        difficulty: 'Advanced',
        duration: 30,
        url: 'https://platform.com/courses/microservices',
        materials: [
          { type: 'Video', title: 'Intro a Microservicios', url: 'https://example.com/video3' }
        ],
        skills: ['Java', 'Spring Boot', 'Docker']
      })
    ]);

    for (const course of courses) {
      await neo4jService.createCourseNode(course.id.toString(), {
        title: course.title,
        category: course.category
      });
    }

    const matchScore1 = await mongoService.calculateMatchScore(
      users[0].id.toString(),
      jobs[0].id.toString()
    );

    await mongoService.createApplication({
      userId: users[0]._id,
      jobPostingId: jobs[0]._id,
      status: 'Applied',
      matchScore: matchScore1
    });

    await neo4jService.createApplicationRelationship(
      users[0].id.toString(),
      jobs[0].id.toString(),
      'Applied',
      matchScore1
    );

    await neo4jService.createRecommendationRelationship(
      users[0].id.toString(),
      users[2].id.toString()
    );


    await neo4jService.close();
    await redisClient.quit();

    console.log('═══════════════════════════════════════════════════');
    console.log('🎉 Seed completado exitosamente!');
    console.log('═══════════════════════════════════════════════════');
    console.log('\n📊 Resumen:');
    console.log(`   - ${companies.length} empresas`);
    console.log(`   - ${users.length} usuarios`);
    console.log(`   - ${jobs.length} ofertas laborales`);
    console.log(`   - ${courses.length} cursos`);
    console.log('\n💡 Puedes probar la API ahora en http://localhost:3000/api\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    process.exit(1);
  }
};

seedDatabase();

