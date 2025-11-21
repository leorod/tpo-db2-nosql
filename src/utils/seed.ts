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

    console.log('👥 Creando usuarios...');
    
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
      }),
      // Nuevo usuario que trabaja en TechCorp (colega de Juan)
      mongoService.createUser({
        name: 'Laura Martínez',
        email: 'laura.martinez@example.com',
        location: 'Buenos Aires, Argentina',
        bio: 'Frontend developer especializada en React y diseño UI/UX',
        currentRole: 'Frontend Developer',
        isEmployee: true,
        skills: [
          { name: 'React', level: 'Expert', yearsOfExperience: 5 },
          { name: 'JavaScript', level: 'Advanced', yearsOfExperience: 6 },
          { name: 'TypeScript', level: 'Advanced', yearsOfExperience: 4 },
          { name: 'CSS', level: 'Expert', yearsOfExperience: 7 }
        ],
        experience: [
          {
            company: 'TechCorp Solutions',
            role: 'Frontend Developer',
            startDate: new Date('2021-05-01'),
            description: 'Desarrollo de interfaces de usuario'
          }
        ],
        education: [
          {
            institution: 'UADE',
            degree: 'Licenciatura',
            field: 'Diseño Multimedial',
            graduationYear: 2018
          }
        ]
      }),
      // Nuevo usuario que también trabaja en DataScience Labs
      mongoService.createUser({
        name: 'Pedro Sánchez',
        email: 'pedro.sanchez@example.com',
        location: 'Córdoba, Argentina',
        bio: 'Data Engineer especializado en pipelines de datos',
        currentRole: 'Data Engineer',
        isEmployee: true,
        skills: [
          { name: 'Python', level: 'Expert', yearsOfExperience: 5 },
          { name: 'SQL', level: 'Expert', yearsOfExperience: 6 },
          { name: 'Apache Spark', level: 'Advanced', yearsOfExperience: 3 },
          { name: 'Airflow', level: 'Advanced', yearsOfExperience: 2 }
        ],
        experience: [
          {
            company: 'DataScience Labs',
            role: 'Data Engineer',
            startDate: new Date('2020-08-15'),
            description: 'Construcción de pipelines ETL'
          }
        ],
        education: [
          {
            institution: 'UNC',
            degree: 'Ingeniería',
            field: 'Computación',
            graduationYear: 2019
          }
        ]
      }),
      // Nuevo usuario junior buscando trabajo
      mongoService.createUser({
        name: 'Ana López',
        email: 'ana.lopez@example.com',
        location: 'Buenos Aires, Argentina',
        bio: 'Desarrolladora junior en búsqueda de oportunidades',
        currentRole: 'Junior Developer',
        isEmployee: false,
        skills: [
          { name: 'JavaScript', level: 'Intermediate', yearsOfExperience: 2 },
          { name: 'React', level: 'Intermediate', yearsOfExperience: 1 },
          { name: 'Node.js', level: 'Beginner', yearsOfExperience: 1 },
          { name: 'MongoDB', level: 'Beginner', yearsOfExperience: 1 }
        ],
        experience: [],
        education: [
          {
            institution: 'UADE',
            degree: 'Tecnicatura',
            field: 'Programación',
            graduationYear: 2023
          }
        ]
      })
    ]);

    console.log('🔗 Creando nodos y relaciones en Neo4j...');
    
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


    console.log('💼 Creando ofertas de trabajo...');
    
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

      for (const skill of job.requiredSkills) {
        await neo4jService.createRequiresSkillRelationship(
          job.id.toString(),
          skill
        );
      }
    }

    console.log('📚 Creando cursos...');
    
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

    console.log('📝 Creando aplicaciones a trabajos...');
    
    // Juan aplica al trabajo de Full-Stack (match perfecto)
    const matchScore1 = await mongoService.calculateMatchScore(
      users[0].id.toString(),
      jobs[0].id.toString()
    );
    await mongoService.createApplication({
      userId: users[0]._id,
      jobPostingId: jobs[0]._id,
      status: 'Interview',
      matchScore: matchScore1
    });
    await neo4jService.createApplicationRelationship(
      users[0].id.toString(),
      jobs[0].id.toString(),
      'Interview',
      matchScore1
    );

    // María aplica al trabajo de Data Scientist (match perfecto)
    const matchScore2 = await mongoService.calculateMatchScore(
      users[1].id.toString(),
      jobs[1].id.toString()
    );
    await mongoService.createApplication({
      userId: users[1]._id,
      jobPostingId: jobs[1]._id,
      status: 'Offer',
      matchScore: matchScore2
    });
    await neo4jService.createApplicationRelationship(
      users[1].id.toString(),
      jobs[1].id.toString(),
      'Offer',
      matchScore2
    );

    // Carlos aplica al trabajo de Java Backend (match perfecto)
    const matchScore3 = await mongoService.calculateMatchScore(
      users[2].id.toString(),
      jobs[2].id.toString()
    );
    await mongoService.createApplication({
      userId: users[2]._id,
      jobPostingId: jobs[2]._id,
      status: 'Applied',
      matchScore: matchScore3
    });
    await neo4jService.createApplicationRelationship(
      users[2].id.toString(),
      jobs[2].id.toString(),
      'Applied',
      matchScore3
    );

    // Ana (junior) aplica a varios trabajos
    const matchScore4 = await mongoService.calculateMatchScore(
      users[5].id.toString(),
      jobs[0].id.toString()
    );
    await mongoService.createApplication({
      userId: users[5]._id,
      jobPostingId: jobs[0]._id,
      status: 'Applied',
      matchScore: matchScore4
    });
    await neo4jService.createApplicationRelationship(
      users[5].id.toString(),
      jobs[0].id.toString(),
      'Applied',
      matchScore4
    );

    console.log('🤝 Creando red social (recomendaciones y mentorías)...');
    
    // Recomendaciones mutuas entre colegas de TechCorp
    await neo4jService.createRecommendationRelationship(
      users[0].id.toString(), // Juan
      users[3].id.toString()  // Laura
    );
    await neo4jService.createRecommendationRelationship(
      users[3].id.toString(), // Laura
      users[0].id.toString()  // Juan
    );

    // Recomendaciones entre colegas de DataScience Labs
    await neo4jService.createRecommendationRelationship(
      users[1].id.toString(), // María
      users[4].id.toString()  // Pedro
    );

    // Carlos recomienda a Juan
    await neo4jService.createRecommendationRelationship(
      users[2].id.toString(), // Carlos
      users[0].id.toString()  // Juan
    );

    // Juan mentora a Ana (junior)
    await neo4jService.createMentorRelationship(
      users[0].id.toString(), // Juan (mentor)
      users[5].id.toString()  // Ana (mentee)
    );

    // María mentora a Pedro
    await neo4jService.createMentorRelationship(
      users[1].id.toString(), // María (mentor)
      users[4].id.toString()  // Pedro (mentee)
    );

    console.log('📚 Inscribiendo usuarios en cursos...');
    
    // Juan completa el curso de React
    await mongoService.enrollUserInCourse(users[0].id.toString(), courses[0].id.toString());
    await neo4jService.createCourseRelationship(
      users[0].id.toString(),
      courses[0].id.toString(),
      'COMPLETED',
      100
    );
    await mongoService.updateLearningProgress(
      users[0].id.toString(),
      courses[0].id.toString(),
      { progressPercentage: 100, status: 'Completed' }
    );

    // Laura también completa el curso de React
    await mongoService.enrollUserInCourse(users[3].id.toString(), courses[0].id.toString());
    await neo4jService.createCourseRelationship(
      users[3].id.toString(),
      courses[0].id.toString(),
      'COMPLETED',
      100
    );
    await mongoService.updateLearningProgress(
      users[3].id.toString(),
      courses[0].id.toString(),
      { progressPercentage: 100, status: 'Completed' }
    );

    // María completa el curso de ML
    await mongoService.enrollUserInCourse(users[1].id.toString(), courses[1].id.toString());
    await neo4jService.createCourseRelationship(
      users[1].id.toString(),
      courses[1].id.toString(),
      'COMPLETED',
      100
    );

    // Ana se inscribe en el curso de React (en progreso)
    await mongoService.enrollUserInCourse(users[5].id.toString(), courses[0].id.toString());
    await neo4jService.createCourseRelationship(
      users[5].id.toString(),
      courses[0].id.toString(),
      'ENROLLED_IN',
      45
    );
    await mongoService.updateLearningProgress(
      users[5].id.toString(),
      courses[0].id.toString(),
      { progressPercentage: 45, status: 'In Progress' }
    );


    await neo4jService.close();
    await redisClient.quit();

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('🎉 Seed completado exitosamente!');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('\n📊 Resumen:');
    console.log(`   ✓ ${companies.length} empresas creadas`);
    console.log(`   ✓ ${users.length} usuarios creados`);
    console.log(`   ✓ ${jobs.length} ofertas laborales`);
    console.log(`   ✓ ${courses.length} cursos`);
    console.log(`   ✓ 4 aplicaciones a trabajos`);
    console.log(`   ✓ 4 relaciones de recomendación`);
    console.log(`   ✓ 2 relaciones de mentoría`);
    console.log(`   ✓ 4 inscripciones a cursos`);
    
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('🧪 ENDPOINTS DE NEO4J LISTOS PARA PROBAR');
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    console.log('1️⃣  RED DE COLEGAS (WORKS_AT relationship):');
    console.log('   📍 Encuentra colegas de Juan en TechCorp:');
    console.log(`   curl http://localhost:3000/network/${users[0].id}/colleagues`);
    console.log(`\n   📍 Encuentra colegas de María en DataScience Labs:`);
    console.log(`   curl http://localhost:3000/network/${users[1].id}/colleagues\n`);
    
    console.log('2️⃣  RECOMENDACIONES DE TRABAJOS (HAS_SKILL matching):');
    console.log('   📍 Jobs recomendados para Ana (junior con React/JS):');
    console.log(`   curl http://localhost:3000/recommendations/user/${users[5].id}/jobs?limit=5`);
    console.log(`\n   📍 Jobs recomendados para Carlos (Java/Spring):`)
    console.log(`   curl http://localhost:3000/recommendations/user/${users[2].id}/jobs?limit=5\n`);
    
    console.log('3️⃣  HISTORIAL DE APLICACIONES (APPLIED_FOR relationship):');
    console.log('   📍 Historial completo de Juan:');
    console.log(`   curl http://localhost:3000/analytics/user/${users[0].id}/history`);
    console.log(`\n   📍 Historial completo de Ana (junior):`)
    console.log(`   curl http://localhost:3000/analytics/user/${users[5].id}/history\n`);
    
    console.log('4️⃣  RECOMENDACIONES DE CURSOS (red social + COMPLETED):');
    console.log('   📍 Cursos recomendados para Ana basados en su red:');
    console.log(`   curl http://localhost:3000/recommendations/user/${users[5].id}/courses?limit=5\n`);
    
    console.log('5️⃣  MATCHING DE CANDIDATOS (skill matching):');
    console.log('   📍 Mejores candidatos para Full-Stack Developer:');
    console.log(`   curl http://localhost:3000/matching/job/${jobs[0].id}/candidates?limit=10\n`);
    
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('📝 IDs ÚTILES PARA TESTING:\n');
    console.log(`   Juan Pérez (Full-stack Senior):     ${users[0].id}`);
    console.log(`   María González (Data Scientist):    ${users[1].id}`);
    console.log(`   Carlos Rodríguez (Java Backend):    ${users[2].id}`);
    console.log(`   Laura Martínez (Frontend):          ${users[3].id}`);
    console.log(`   Pedro Sánchez (Data Engineer):      ${users[4].id}`);
    console.log(`   Ana López (Junior Developer):       ${users[5].id}`);
    console.log('');
    console.log(`   TechCorp Solutions:                 ${companies[0].id}`);
    console.log(`   DataScience Labs:                   ${companies[1].id}`);
    console.log(`   FinTech Innovations:                ${companies[2].id}`);
    console.log('');
    console.log(`   Job - Full-Stack Developer:         ${jobs[0].id}`);
    console.log(`   Job - Data Scientist:               ${jobs[1].id}`);
    console.log(`   Job - Backend Java:                 ${jobs[2].id}`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    process.exit(1);
  }
};

seedDatabase();

