# 🚀 Talentum+ - Plataforma Integral de Gestión de Talento IT

## 📋 Descripción del Proyecto

**Talentum+** es una plataforma completa para gestionar el ciclo de vida del talento IT, desde la atracción y reclutamiento hasta el desarrollo profesional. El sistema integra tres bases de datos especializadas para optimizar diferentes aspectos del negocio.

### ✨ Características Principales

- ✅ **Gestión de Candidatos y Empleados**
- ✅ **Sistema de Matching Inteligente** 
- ✅ **Tracking de Procesos de Selección**
- ✅ **Plataforma de Capacitación**
- ✅ **Sistema de Recomendaciones**
- ✅ **Networking Profesional**
- ✅ **Análisis de Relaciones (Grafo)**
- ✅ **Caché de Alto Rendimiento**

---

## 🏗️ Arquitectura Multi-Base de Datos

### 1. **MongoDB** 🍃
**Propósito:** Almacenamiento de datos estructurados y documentos complejos

**Almacena:**
- Perfiles completos de usuarios (candidatos/empleados)
- Información de empresas
- Ofertas laborales con requisitos detallados
- Aplicaciones con historial de entrevistas
- Cursos con materiales y contenido
- Progreso de aprendizaje de usuarios

**Ventajas:**
- Flexibilidad en el esquema
- Consultas eficientes por índices
- Manejo de documentos complejos anidados
- Escalabilidad horizontal

---

### 2. **Neo4j** 🔗
**Propósito:** Modelado y análisis de relaciones complejas (grafos)

**Almacena:**
- Relaciones entre usuarios y empresas (WORKS_AT)
- Skills de usuarios (HAS_SKILL)
- Aplicaciones a ofertas (APPLIED_FOR)
- Empresas y sus ofertas (POSTED)
- Red de contactos (RECOMMENDED_TO)
- Mentorías (MENTORS)
- Progreso en cursos (ENROLLED_IN, COMPLETED)

**Ventajas:**
- Consultas de relaciones en tiempo O(1)
- Recomendaciones basadas en red social
- Análisis de trayectorias profesionales
- Matching inteligente por skills
- Detección de patrones en la red

**Casos de Uso:**
```cypher
// Encontrar candidatos que matchean con una oferta
MATCH (u:User)-[:HAS_SKILL]->(s:Skill)
WHERE s.name IN ['React', 'Node.js']
RETURN u, COUNT(s) as matchingSkills

// Recomendar cursos basados en red de contactos
MATCH (user:User)-[:RECOMMENDED_TO*1..2]-(contact:User)
      -[:COMPLETED]->(course:Course)
WHERE NOT (user)-[:COMPLETED]->(course)
RETURN course, COUNT(contact) as popularity
```

---

### 3. **Redis** ⚡
**Propósito:** Caché, sesiones y datos en tiempo real

**Almacena:**
- Caché de usuarios y ofertas
- Resultados de matching
- Recomendaciones calculadas
- Sesiones de usuario
- Rate limiting
- Actividad reciente
- Contadores en tiempo real
- Leaderboards

**Ventajas:**
- Velocidad extrema (memoria RAM)
- TTL automático para datos temporales
- Estructuras de datos especializadas
- Reduce carga en MongoDB/Neo4j

---

## 📊 Modelo de Datos

### MongoDB - Colecciones

#### **Users**
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  location: String,
  bio: String,
  currentRole: String,
  isEmployee: Boolean,
  skills: [{
    name: String,
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert',
    yearsOfExperience: Number
  }],
  experience: [{
    company: String,
    role: String,
    startDate: Date,
    endDate: Date,
    description: String
  }],
  education: [{
    institution: String,
    degree: String,
    field: String,
    graduationYear: Number
  }]
}
```

#### **Companies**
```javascript
{
  name: String,
  industry: String,
  description: String,
  website: String,
  foundedYear: Number,
  size: String,
  location: String
}
```

#### **JobPostings**
```javascript
{
  title: String,
  companyId: ObjectId (ref: Company),
  description: String,
  requirements: [String],
  location: String,
  salaryRange: { min: Number, max: Number, currency: String },
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance',
  level: 'Junior' | 'Mid' | 'Senior' | 'Lead',
  requiredSkills: [String],
  isActive: Boolean
}
```

#### **Applications**
```javascript
{
  userId: ObjectId,
  jobPostingId: ObjectId,
  status: 'Applied' | 'Preselection' | 'Interview' | 'Technical' | 'Offer' | 'Hired' | 'Rejected',
  appliedAt: Date,
  interviews: [{
    type: 'HR' | 'Technical' | 'Cultural' | 'Final',
    date: Date,
    feedback: String,
    confidentialNotes: String,
    score: Number (0-10)
  }],
  matchScore: Number (0-100),
  rejectionReason: String
}
```

---

### Neo4j - Nodos y Relaciones

#### **Nodos**
- `(:User)` - Candidatos y empleados
- `(:Company)` - Empresas
- `(:JobPosting)` - Ofertas laborales
- `(:Skill)` - Habilidades técnicas y soft
- `(:Course)` - Cursos de capacitación

#### **Relaciones**
- `(:User)-[:WORKS_AT {role, startDate, endDate}]->(:Company)`
- `(:User)-[:HAS_SKILL {level, yearsOfExperience}]->(:Skill)`
- `(:User)-[:APPLIED_FOR {status, matchScore}]->(:JobPosting)`
- `(:Company)-[:POSTED]->(:JobPosting)`
- `(:User)-[:ENROLLED_IN | COMPLETED {progress}]->(:Course)`
- `(:User)-[:RECOMMENDED_TO]->(:User)`
- `(:User)-[:MENTORS]->(:User)`

---

## 🔧 Stack Tecnológico

- **Backend:** Node.js + TypeScript + Express
- **Bases de Datos:**
  - MongoDB 7 (Mongoose ODM)
  - Neo4j 5.15 (neo4j-driver)
  - Redis 7 (redis client)
- **Containerización:** Docker + Docker Compose
- **Herramientas:** nodemon, ts-node

---

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- Docker Desktop
- npm o yarn

### 1. Clonar el repositorio
```bash
cd tpo-db2
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
El archivo `.env` ya está configurado con:
```env
# Neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=db2passwordsecure!

# MongoDB
MONGO_ROOT_USER=mongodb
MONGO_ROOT_PASSWORD=db2passwordsecure!
MONGO_URI=mongodb://mongodb:db2passwordsecure!@localhost:27017
MONGO_DB=mi_database

# Redis
REDIS_URI=redis://localhost:6379
```

### 4. Iniciar Docker Compose
```bash
docker-compose up -d
```

Esto iniciará:
- MongoDB en puerto 27017
- Neo4j en puertos 7474 (HTTP) y 7687 (Bolt)
- Redis en puerto 6379

### 5. Verificar que los contenedores estén corriendo
```bash
docker ps
```

### 6. Iniciar el servidor
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000/api`

### 7. (Opcional) Poblar la base de datos con datos de ejemplo
```bash
npm run seed
```

Esto creará:
- 3 empresas
- 3 usuarios con skills y experiencia
- 3 ofertas laborales
- 3 cursos
- Aplicaciones de ejemplo
- Relaciones en Neo4j

---

## 📡 Endpoints de la API

### Health Check
- `GET /api/health` - Verificar estado del servidor

### Usuarios
- `POST /api/users` - Crear usuario
- `GET /api/users` - Listar usuarios
- `GET /api/users/:userId` - Obtener usuario por ID
- `PUT /api/users/:userId` - Actualizar usuario
- `GET /api/users/:userId/stats` - Estadísticas del usuario

### Empresas
- `POST /api/companies` - Crear empresa
- `GET /api/companies` - Listar empresas

### Ofertas Laborales
- `POST /api/jobs` - Crear oferta
- `GET /api/jobs` - Listar ofertas activas
- `GET /api/jobs/:jobId` - Obtener oferta por ID

### Aplicaciones
- `POST /api/applications` - Aplicar a oferta
- `GET /api/applications/user/:userId` - Aplicaciones de un usuario
- `GET /api/applications/job/:jobId` - Aplicaciones a una oferta
- `PUT /api/applications/:applicationId/status` - Actualizar estado

### Matching y Recomendaciones
- `GET /api/matching/job/:jobId/candidates` - Candidatos que matchean
- `GET /api/recommendations/user/:userId/jobs` - Jobs recomendados
- `GET /api/recommendations/user/:userId/courses` - Cursos recomendados

### Cursos
- `POST /api/courses` - Crear curso
- `GET /api/courses` - Listar cursos
- `POST /api/courses/enroll` - Inscribirse en curso
- `PUT /api/courses/:userId/:courseId/progress` - Actualizar progreso
- `GET /api/courses/user/:userId` - Cursos de un usuario

### Networking
- `GET /api/network/:userId/colleagues` - Encontrar colegas
- `POST /api/network/recommend` - Crear recomendación
- `POST /api/network/mentorship` - Crear mentoría

### Analíticas
- `GET /api/analytics/user/:userId/history` - Historial de aplicaciones
- `GET /api/analytics/user/:userId/activity` - Actividad reciente

---

## 🎯 Flujo de Uso

1. **Crear empresas** → MongoDB + Neo4j
2. **Crear usuarios con skills** → MongoDB + Neo4j (nodos + relaciones HAS_SKILL)
3. **Crear ofertas laborales** → MongoDB + Neo4j
4. **Usuario aplica a oferta** → Se calcula match score automáticamente
5. **Sistema guarda en MongoDB** (datos) y **Neo4j** (relación APPLIED_FOR)
6. **Redis cachea** los resultados para futuras consultas
7. **Obtener recomendaciones** → Neo4j analiza el grafo + Redis cachea

---

## 🧪 Ejemplos de Prueba

Ver archivo `API_EXAMPLES.md` para ejemplos completos con curl.

---

## 📈 Ventajas de la Arquitectura Multi-DB

### ¿Por qué MongoDB?
- ✅ Perfecto para documentos complejos (perfiles con arrays anidados)
- ✅ Búsquedas eficientes con índices
- ✅ Esquema flexible para evolución del modelo

### ¿Por qué Neo4j?
- ✅ Recomendaciones en tiempo real
- ✅ Matching inteligente basado en relaciones
- ✅ Análisis de redes sociales profesionales
- ✅ Queries de "quién conoce a quién" en O(1)

### ¿Por qué Redis?
- ✅ Cachear resultados de matching (costosos de calcular)
- ✅ Sesiones de usuario
- ✅ Rate limiting
- ✅ Reduce carga en las otras bases de datos

---

## 🔍 Acceso a las Bases de Datos

### Neo4j Browser
```
http://localhost:7474
Usuario: neo4j
Password: db2passwordsecure!
```

### MongoDB (con MongoDB Compass)
```
mongodb://mongodb:db2passwordsecure!@localhost:27017
```

### Redis CLI
```bash
docker exec -it redis_db redis-cli
```

---

## 📚 Documentación Adicional

- `API_EXAMPLES.md` - Ejemplos completos de uso de la API
- `IAFALOPA.md` - Diseño conceptual del modelo Neo4j

---

## 🎓 Cumplimiento de Requerimientos del TPO

### ✅ 1. Modelo de Candidatos y Empleados
- MongoDB almacena perfiles completos
- Neo4j modela relaciones y skills
- Historial de cambios y evolución

### ✅ 2. Publicación y Matching Inteligente
- Empresas publican ofertas
- Sistema calcula match score automáticamente
- Neo4j encuentra candidatos por skills

### ✅ 3. Seguimiento de Procesos
- Estados de aplicación completos
- Entrevistas con feedback confidencial
- Historial en Neo4j

### ✅ 4. Gestión de Capacitación
- Catálogo de cursos con materiales
- Tracking de progreso
- Cursos completados en Neo4j

### ✅ 5. Sistema de Recomendaciones
- Basado en red de contactos (Neo4j)
- Cursos recomendados por colegas
- Jobs recomendados por skills

### ✅ 6. Infraestructura y Escalabilidad
- MongoDB para candidatos y ofertas
- Neo4j para relaciones complejas
- Redis para caché y sesiones
- Arquitectura preparada para escalar

---

## 👥 Autores

Federico Herrera - UADE - Bases de Datos 2

---

## 📝 Licencia

ISC

