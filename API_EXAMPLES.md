# Talentum+ API - Ejemplos de Uso

## 📋 Tabla de Contenidos
- [Configuración Inicial](#configuración-inicial)
- [Usuarios](#usuarios)
- [Empresas](#empresas)
- [Ofertas Laborales](#ofertas-laborales)
- [Aplicaciones](#aplicaciones)
- [Matching y Recomendaciones](#matching-y-recomendaciones)
- [Cursos](#cursos)
- [Networking](#networking)
- [Analíticas](#analíticas)

---

## 🚀 Configuración Inicial

### Iniciar Docker
```bash
docker-compose up -d
```

### Iniciar el servidor
```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000/api`

---

## 👤 Usuarios

### Crear un Usuario
```bash
POST /api/users
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan.perez@example.com",
  "phone": "+54 11 1234-5678",
  "location": "Buenos Aires, Argentina",
  "bio": "Full-stack developer con 5 años de experiencia",
  "currentRole": "Senior Developer",
  "isEmployee": false,
  "skills": [
    {
      "name": "JavaScript",
      "level": "Expert",
      "yearsOfExperience": 5
    },
    {
      "name": "React",
      "level": "Advanced",
      "yearsOfExperience": 4
    },
    {
      "name": "Node.js",
      "level": "Advanced",
      "yearsOfExperience": 4
    },
    {
      "name": "MongoDB",
      "level": "Intermediate",
      "yearsOfExperience": 3
    }
  ],
  "experience": [
    {
      "company": "Tech Corp",
      "role": "Senior Developer",
      "startDate": "2020-01-15",
      "description": "Desarrollo de aplicaciones web full-stack"
    }
  ],
  "education": [
    {
      "institution": "UADE",
      "degree": "Licenciatura",
      "field": "Ingeniería en Sistemas",
      "graduationYear": 2019
    }
  ]
}
```

### Obtener Usuario por ID
```bash
GET /api/users/{userId}
```

### Obtener Todos los Usuarios
```bash
GET /api/users
```

### Obtener Estadísticas de Usuario
```bash
GET /api/users/{userId}/stats
```

---

## 🏢 Empresas

### Crear una Empresa
```bash
POST /api/companies
Content-Type: application/json

{
  "name": "Tech Innovations SA",
  "industry": "Technology",
  "description": "Empresa líder en desarrollo de software",
  "website": "https://techinnovations.com",
  "foundedYear": 2015,
  "size": "50-200 employees",
  "location": "Buenos Aires, Argentina"
}
```

### Obtener Todas las Empresas
```bash
GET /api/companies
```

---

## 💼 Ofertas Laborales

### Crear una Oferta Laboral
```bash
POST /api/jobs
Content-Type: application/json

{
  "title": "Senior Full-Stack Developer",
  "companyId": "674d8e9f1234567890abcdef",
  "description": "Buscamos un desarrollador full-stack con experiencia en React y Node.js",
  "requirements": [
    "5+ años de experiencia en desarrollo web",
    "Experiencia con React y Node.js",
    "Conocimiento de bases de datos NoSQL",
    "Trabajo en equipo"
  ],
  "location": "Buenos Aires, Argentina (Híbrido)",
  "salaryRange": {
    "min": 3000,
    "max": 5000,
    "currency": "USD"
  },
  "type": "Full-time",
  "level": "Senior",
  "requiredSkills": ["JavaScript", "React", "Node.js", "MongoDB"],
  "isActive": true
}
```

### Obtener Ofertas Activas
```bash
GET /api/jobs
```

### Obtener Oferta por ID
```bash
GET /api/jobs/{jobId}
```

---

## 📝 Aplicaciones

### Aplicar a una Oferta
```bash
POST /api/applications
Content-Type: application/json

{
  "userId": "674d8e9f1234567890abcdef",
  "jobPostingId": "674d8e9f1234567890fedcba"
}
```

**Nota:** El sistema calculará automáticamente el `matchScore` basado en las skills del usuario y los requisitos del job.

### Obtener Aplicaciones de un Usuario
```bash
GET /api/applications/user/{userId}
```

### Obtener Aplicaciones de una Oferta
```bash
GET /api/applications/job/{jobId}
```

### Actualizar Estado de Aplicación
```bash
PUT /api/applications/{applicationId}/status
Content-Type: application/json

{
  "status": "Interview",
  "rejectionReason": null
}
```

Estados posibles: `Applied`, `Preselection`, `Interview`, `Technical`, `Offer`, `Hired`, `Rejected`

---

## 🎯 Matching y Recomendaciones

### Obtener Candidatos que Matchean con una Oferta
```bash
GET /api/matching/job/{jobId}/candidates?limit=10
```

**Respuesta:** Lista de candidatos ordenados por match score, combinando datos de MongoDB y Neo4j.

### Obtener Ofertas Recomendadas para un Usuario
```bash
GET /api/recommendations/user/{userId}/jobs?limit=10
```

**Respuesta:** Lista de ofertas laborales recomendadas basadas en:
- Skills del usuario
- Historial de aplicaciones
- Red de contactos (Neo4j)

### Obtener Cursos Recomendados
```bash
GET /api/recommendations/user/{userId}/courses?limit=5
```

**Respuesta:** Cursos recomendados basados en:
- Cursos completados por contactos en la red
- Skills que necesita mejorar
- Tendencias en la industria

---

## 📚 Cursos

### Crear un Curso
```bash
POST /api/courses
Content-Type: application/json

{
  "title": "React Avanzado: Hooks y Context API",
  "description": "Aprende los conceptos avanzados de React",
  "category": "Frontend Development",
  "difficulty": "Advanced",
  "duration": 20,
  "url": "https://platform.com/courses/react-advanced",
  "materials": [
    {
      "type": "Video",
      "title": "Introducción a Hooks",
      "url": "https://platform.com/videos/hooks-intro"
    },
    {
      "type": "PDF",
      "title": "Guía de Context API",
      "url": "https://platform.com/pdfs/context-guide.pdf"
    }
  ],
  "skills": ["React", "JavaScript", "Frontend"]
}
```

### Obtener Todos los Cursos
```bash
GET /api/courses
```

### Inscribirse en un Curso
```bash
POST /api/courses/enroll
Content-Type: application/json

{
  "userId": "674d8e9f1234567890abcdef",
  "courseId": "674d8e9f1234567890fedcba"
}
```

### Actualizar Progreso en un Curso
```bash
PUT /api/courses/{userId}/{courseId}/progress
Content-Type: application/json

{
  "progressPercentage": 75,
  "status": "In Progress"
}
```

### Obtener Cursos de un Usuario
```bash
GET /api/courses/user/{userId}
```

---

## 🤝 Networking

### Obtener Colegas (trabajaron en la misma empresa)
```bash
GET /api/network/{userId}/colleagues
```

### Crear Recomendación entre Usuarios
```bash
POST /api/network/recommend
Content-Type: application/json

{
  "fromUserId": "674d8e9f1234567890abcdef",
  "toUserId": "674d8e9f1234567890fedcba"
}
```

### Crear Relación de Mentoría
```bash
POST /api/network/mentorship
Content-Type: application/json

{
  "mentorId": "674d8e9f1234567890abcdef",
  "menteeId": "674d8e9f1234567890fedcba"
}
```

---

## 📊 Analíticas

### Obtener Historial de Aplicaciones (Neo4j)
```bash
GET /api/analytics/user/{userId}/history
```

### Obtener Actividad Reciente (Redis)
```bash
GET /api/analytics/user/{userId}/activity?count=20
```

---

## 🧪 Flujo Completo de Ejemplo

### 1. Crear una empresa
```bash
curl -X POST http://localhost:3000/api/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TechStartup",
    "industry": "Technology",
    "location": "Buenos Aires"
  }'
```

### 2. Crear un usuario candidato
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "María González",
    "email": "maria@example.com",
    "skills": [
      {"name": "Python", "level": "Expert"},
      {"name": "Django", "level": "Advanced"}
    ]
  }'
```

### 3. Crear una oferta laboral
```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Python Developer",
    "companyId": "COMPANY_ID_FROM_STEP_1",
    "description": "Backend developer needed",
    "requiredSkills": ["Python", "Django"],
    "type": "Full-time",
    "level": "Mid",
    "location": "Buenos Aires"
  }'
```

### 4. Aplicar a la oferta
```bash
curl -X POST http://localhost:3000/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_FROM_STEP_2",
    "jobPostingId": "JOB_ID_FROM_STEP_3"
  }'
```

### 5. Ver candidatos que matchean
```bash
curl http://localhost:3000/api/matching/job/JOB_ID_FROM_STEP_3/candidates
```

---

## 🔍 Health Check

```bash
GET /api/health
```

Respuesta:
```json
{
  "success": true,
  "message": "Talentum+ API is running",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

## 🏗️ Arquitectura de Bases de Datos

### MongoDB
- **Almacena:** Datos completos de usuarios, empresas, ofertas, cursos, aplicaciones
- **Uso:** CRUD operations, búsquedas por filtros, datos estructurados

### Neo4j
- **Almacena:** Relaciones entre entidades (grafos)
- **Uso:** Matching, recomendaciones, análisis de redes, trayectorias profesionales

### Redis
- **Almacena:** Caché, sesiones, rate limiting, contadores
- **Uso:** Performance optimization, datos temporales, actividad en tiempo real

---

## 📝 Notas Importantes

1. **Match Score:** Se calcula automáticamente al aplicar a una oferta
2. **Caché:** Los datos se cachean en Redis para mejorar performance
3. **Relaciones:** Se mantienen sincronizadas entre MongoDB y Neo4j
4. **Seguridad:** Las notas confidenciales en entrevistas están protegidas
5. **Escalabilidad:** Sistema preparado para manejar miles de usuarios y ofertas

---

## 🐛 Troubleshooting

### Docker no inicia
```bash
docker-compose down
docker-compose up -d
```

### Limpiar caché de Redis
```bash
docker exec -it redis_db redis-cli FLUSHALL
```

### Ver logs de MongoDB
```bash
docker logs mongo_db
```

### Ver logs de Neo4j
```bash
docker logs neo4j_db
```

