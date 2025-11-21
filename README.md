# 🎓 Talentum+ Platform - TPO Bases de Datos 2

## 📋 Descripción del Proyecto

**Talentum+** es una plataforma integral de desarrollo profesional y matching laboral que conecta profesionales, empresas, cursos y oportunidades laborales. El sistema implementa una arquitectura multi-base de datos para optimizar diferentes aspectos de la aplicación.

### 🎯 Funcionalidades Principales

- 👥 **Gestión de Usuarios y Perfiles**: Usuarios con skills, experiencia y educación
- 🏢 **Directorio de Empresas**: Información completa de empresas y sus ofertas
- 💼 **Ofertas Laborales**: Publicación y gestión de ofertas de trabajo
- 📚 **Plataforma de Cursos**: Catálogo de cursos con inscripciones y seguimiento de progreso
- 🤝 **Networking Profesional**: Conexiones entre colegas, mentorías y recomendaciones
- 🎯 **Sistema de Matching**: Recomendaciones inteligentes de empleos y cursos
- 📊 **Analytics y Seguimiento**: Historial de aplicaciones y actividad de usuarios
- 🏆 **Certificaciones**: Gestión de certificaciones profesionales

---

## 🏗️ Arquitectura del Sistema

### Arquitectura Multi-Base de Datos

El proyecto implementa una arquitectura **polyglot persistence**, utilizando diferentes bases de datos según las necesidades específicas de cada dominio:

```
┌─────────────────────────────────────────────────────────┐
│              Backend API (Node.js + Express)            │
│              http://localhost:3000/api                  │
└──────┬──────────────┬──────────────┬────────────────────┘
       │              │              │
       ▼              ▼              ▼
┌──────────────┐ ┌──────────┐ ┌────────────┐
│   MongoDB    │ │  Neo4j   │ │   Redis    │
│   :27017     │ │  :7687   │ │   :6379    │
│              │ │  :7474   │ │            │
└──────────────┘ └──────────┘ └────────────┘
```

### 📊 Distribución de Datos por Base de Datos

#### 🍃 MongoDB (Base de Datos Documental)
**Puerto:** 27017  
**Propósito:** Almacenamiento de documentos con esquemas flexibles y datos anidados

**Colecciones:**
- **Users**: Perfiles de usuarios con skills, experiencia, educación
- **Companies**: Información de empresas
- **JobPostings**: Ofertas laborales con requisitos y beneficios
- **Courses**: Catálogo de cursos con materiales
- **Applications**: Aplicaciones a trabajos con entrevistas
- **Enrollments**: Inscripciones a cursos con progreso y scores
- **Certifications**: Certificaciones profesionales

**Por qué MongoDB:**
- Esquemas flexibles para perfiles de usuario con diferentes atributos
- Documentos anidados para skills, experiencia y educación
- Arrays embebidos para múltiples entidades relacionadas
- Consultas rápidas sobre documentos completos

#### 🌐 Neo4j (Base de Datos de Grafos)
**Puerto HTTP:** 7474 (Neo4j Browser)  
**Puerto Bolt:** 7687 (Conexión de aplicación)  
**Propósito:** Modelado de relaciones complejas y recomendaciones

**Nodos:**
- **User**: Usuarios de la plataforma
- **Company**: Empresas
- **Skill**: Habilidades profesionales
- **Course**: Cursos disponibles

**Relaciones:**
- `WORKS_AT`: Usuario → Empresa (con atributos de rol y fechas)
- `HAS_SKILL`: Usuario → Skill (con nivel de experiencia)
- `APPLIED_TO`: Usuario → JobPosting (estado de aplicación)
- `ENROLLED_IN`: Usuario → Course (progreso)
- `REQUIRES_SKILL`: JobPosting → Skill (nivel requerido)
- `TEACHES_SKILL`: Course → Skill
- `COLLEAGUE_OF`: Usuario ↔ Usuario
- `MENTORS`: Usuario → Usuario
- `RECOMMENDS`: Usuario → Usuario (recomendaciones profesionales)

**Por qué Neo4j:**
- Queries de traversal eficientes para recomendaciones
- Análisis de rutas entre entidades (grados de separación)
- Matching de candidatos basado en skills compartidas
- Detección de patrones en redes profesionales
- Consultas tipo "encuentra colegas de colegas"

#### 🚀 Redis (Cache en Memoria)
**Puerto:** 6379  
**Propósito:** Cache de alto rendimiento y datos de sesión

**Uso:**
- **Cache de Consultas**: Resultados de búsquedas frecuentes
- **Cache de Usuario**: Estadísticas y perfiles
- **Cache de Jobs**: Listados de trabajos activos
- **Cache de Empresas**: Directorio de empresas
- **Datos de Sesión**: Información temporal de usuario

**Estrategia de Cache:**
- TTL (Time To Live) de 1 hora para datos dinámicos
- Invalidación manual en operaciones de escritura
- Patrón de cache-aside (lazy loading)

**Por qué Redis:**
- Respuestas en milisegundos para consultas frecuentes
- Reducción de carga en bases de datos primarias
- Escalabilidad horizontal
- Soporte nativo para estructuras de datos complejas

---

## 🛠️ Stack Tecnológico

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express 5
- **Lenguaje**: TypeScript
- **ODM/ORM**: Mongoose (MongoDB)
- **Graph Driver**: neo4j-driver
- **Cache Client**: redis
- **Build Tool**: TSC (TypeScript Compiler)
- **Dev Tool**: Nodemon

### Bases de Datos
- **MongoDB 7**: Base de datos documental
- **Neo4j 5.15**: Base de datos de grafos (con APOC)
- **Redis 7**: Cache en memoria

### DevOps
- **Containerización**: Docker & Docker Compose
- **Orquestación**: Docker Compose para desarrollo local

---

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18.0.0 ([Descargar](https://nodejs.org/))
- **npm** >= 9.0.0 (viene con Node.js)
- **Docker Desktop** ([Descargar](https://www.docker.com/products/docker-desktop))
- **Docker Compose** (incluido en Docker Desktop)
- **Git** ([Descargar](https://git-scm.com/))

### Verificar Instalaciones

```bash
node --version    # Debe ser >= v18.0.0
npm --version     # Debe ser >= 9.0.0
docker --version  # Debe estar instalado
docker-compose --version  # Debe estar instalado
git --version     # Debe estar instalado
```

---

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
# Clonar el proyecto
git clone https://github.com/tu-usuario/tpo-db2.git
cd tpo-db2/backend
```

### 2. Configuración de Variables de Entorno

Crear archivo `.env` en la carpeta raíz del backend:

```bash
cat > .env << 'EOF'
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=db2passwordsecure!
MONGO_DB=talentum_db
MONGO_URI=mongodb://admin:db2passwordsecure!@localhost:27017/talentum_db?authSource=admin

# Neo4j Configuration
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=db2passwordsecure!

# Redis Configuration
REDIS_URI=redis://localhost:6379
EOF
```

**Importante:** 
- Las contraseñas deben coincidir con las del `docker-compose.yml`
- No commitear el archivo `.env` a Git (ya está en `.gitignore`)

### 3. Levantar Bases de Datos con Docker

```bash
# Levantar contenedores en background
docker-compose up -d

# Ver logs de contenedores
docker-compose logs -f

# Verificar que todos los contenedores estén corriendo
docker-compose ps
```

**Contenedores que deben estar corriendo:**
- `neo4j_db` - Neo4j Database (Puertos 7474, 7687)
- `mongo_db` - MongoDB Database (Puerto 27017)
- `redis_db` - Redis Cache (Puerto 6379)

#### Acceso a las Bases de Datos

**Neo4j Browser:**
- URL: http://localhost:7474
- Usuario: `neo4j`
- Contraseña: `db2passwordsecure!`

**MongoDB (usando MongoDB Compass):**
- URI: `mongodb://admin:db2passwordsecure!@localhost:27017/talentum_db?authSource=admin`

**Redis (usando redis-cli):**
```bash
docker exec -it redis_db redis-cli
```

### 4. Instalar Dependencias

```bash
npm install
```

**Dependencias principales:**
- express: Framework web
- mongoose: ODM para MongoDB
- neo4j-driver: Driver para Neo4j
- redis: Cliente para Redis
- typescript: Soporte TypeScript
- dotenv: Variables de entorno

### 5. Sembrar la Base de Datos (Seed)

Una vez que las bases de datos están corriendo y las dependencias instaladas:

```bash
npm run seed
```

**El script de seed creará:**
- ✅ 10+ usuarios con perfiles completos
- ✅ 5 empresas
- ✅ 15+ ofertas de trabajo
- ✅ 20+ cursos
- ✅ Aplicaciones de ejemplo
- ✅ Inscripciones a cursos
- ✅ Conexiones entre usuarios (Neo4j)
- ✅ Relaciones de skills y mentorías
- ✅ Cache inicial en Redis

**Tiempo estimado:** 10-30 segundos

**Output esperado:**
```
🌱 Iniciando seed de la base de datos...
MongoDB connected successfully
Neo4j connected successfully
Redis connected successfully
📊 Creando empresas...
👥 Creando usuarios...
💼 Creando ofertas de trabajo...
📚 Creando cursos...
📝 Creando aplicaciones...
🎓 Creando inscripciones...
🔗 Creando relaciones en Neo4j...
✅ Seed completado exitosamente!
```

---

## 🏃 Ejecución del Proyecto

### Opción 1: Dos Terminales Separadas (Recomendado)

**Terminal 1 - Bases de Datos:**
```bash
docker-compose up
```

**Terminal 2 - Backend:**
```bash
npm start
```

### Opción 2: Background + Foreground

**Paso 1 - Bases de datos en background:**
```bash
docker-compose up -d
```

**Paso 2 - Backend:**
```bash
npm start
```

### Acceso a la Aplicación

Una vez que todo esté corriendo:

- **Backend API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/api/health
- **Neo4j Browser**: http://localhost:7474

---

## 📜 Scripts Disponibles

```bash
# Desarrollo - Inicia servidor con hot reload
npm start

# Compilar TypeScript a JavaScript
npm run build

# Sembrar base de datos con datos de ejemplo
npm run seed
```

### Docker

```bash
# Iniciar contenedores
docker-compose up

# Iniciar en background
docker-compose up -d

# Detener contenedores
docker-compose down

# Detener y eliminar volúmenes (CUIDADO: borra datos)
docker-compose down -v

# Ver logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f mongo_db
docker-compose logs -f neo4j_db
docker-compose logs -f redis_db

# Reiniciar un servicio
docker-compose restart mongo_db

# Ver estado de contenedores
docker-compose ps

# Ejecutar comando en contenedor
docker-compose exec mongo_db mongosh
docker-compose exec redis_db redis-cli
```

---

## 🛣️ API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Health & Status
```
GET  /              # Health check
GET  /health        # Health check detallado
```

### 👥 Usuarios
```
POST   /users                    # Crear usuario
GET    /users                    # Obtener todos los usuarios
GET    /users/:userId            # Obtener usuario por ID
PUT    /users/:userId            # Actualizar usuario
GET    /users/:userId/stats      # Estadísticas del usuario
```

### 🏢 Empresas
```
POST   /companies               # Crear empresa
GET    /companies               # Obtener todas las empresas
```

### 💼 Ofertas de Trabajo
```
POST   /jobs                    # Crear oferta de trabajo
GET    /jobs                    # Obtener ofertas activas
GET    /jobs/:jobId             # Obtener oferta por ID
GET    /matching/job/:jobId/candidates  # Candidatos matching
```

### 📝 Aplicaciones
```
POST   /applications            # Aplicar a trabajo
GET    /applications/user/:userId        # Aplicaciones de usuario
GET    /applications/job/:jobId          # Aplicaciones de trabajo
PUT    /applications/:applicationId/status  # Actualizar estado
POST   /applications/:applicationId/interviews  # Agregar entrevista
GET    /applications/:applicationId/interviews  # Ver entrevistas
PUT    /applications/:applicationId/interviews/:index  # Actualizar entrevista
```

### 📚 Cursos
```
POST   /courses                 # Crear curso
GET    /courses                 # Obtener todos los cursos
POST   /courses/enroll          # Inscribirse a curso
PUT    /courses/:userId/:courseId/progress  # Actualizar progreso
PUT    /courses/:userId/:courseId/score     # Actualizar puntaje
GET    /courses/user/:userId    # Cursos de usuario
GET    /courses/:userId/scores  # Puntajes de usuario
```

### 🎯 Recomendaciones
```
GET    /recommendations/user/:userId/jobs     # Jobs recomendados
GET    /recommendations/user/:userId/courses  # Cursos recomendados
```

### 🏆 Certificaciones
```
POST   /certifications                      # Crear certificación
GET    /certifications/user/:userId         # Certificaciones de usuario
GET    /certifications/user/:userId/active  # Certificaciones activas
GET    /certifications/:certificationId     # Obtener por ID
PUT    /certifications/:certificationId     # Actualizar certificación
DELETE /certifications/:certificationId     # Eliminar certificación
GET    /certifications/skill/:skill         # Por skill
```

### 🤝 Red Profesional
```
GET    /network/:userId/colleagues   # Obtener colegas
POST   /network/recommend           # Agregar recomendación
POST   /network/mentorship          # Crear mentoría
```

### 📊 Analytics
```
GET    /analytics/user/:userId/history   # Historial de aplicaciones
GET    /analytics/user/:userId/activity  # Actividad reciente
```

### Ejemplos de Uso con cURL

```bash
# Health Check
curl http://localhost:3000/api/health

# Obtener todos los usuarios
curl http://localhost:3000/api/users

# Crear usuario
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "location": "Buenos Aires",
    "skills": [{"name": "JavaScript", "level": "Advanced"}]
  }'

# Obtener trabajos
curl http://localhost:3000/api/jobs

# Aplicar a trabajo
curl -X POST http://localhost:3000/api/applications \
  -H "Content-Type: application/json" \
  -d '{"userId": "USER_ID", "jobPostingId": "JOB_ID"}'
```

---

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/              # Configuraciones
│   │   └── database.ts      # Conexiones a DBs
│   ├── controllers/         # Controladores
│   │   └── dbControllers.ts # Lógica de negocio
│   ├── models/              # Modelos de datos
│   │   └── mongodb/
│   │       └── mongodbModel.ts  # Schemas Mongoose
│   ├── routes/              # Definición de rutas
│   │   └── routes.ts
│   ├── services/            # Servicios de DB
│   │   ├── mongodb/
│   │   │   └── mongodbService.ts
│   │   ├── neo4j/
│   │   │   └── neoService.ts
│   │   └── redis/
│   │       └── redisService.ts
│   ├── utils/               # Utilidades
│   │   ├── seed.ts          # Script de seed
│   │   └── utils.ts
│   └── index.ts             # Entry point
├── scripts/                 # Scripts externos
│   ├── modelo-mongo.json    # Modelo MongoDB
│   └── neo4j.cypher        # Queries Neo4j
├── docker-compose.yml       # Orquestación Docker
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔧 Desarrollo

### Workflow de Desarrollo

1. **Asegurarse que Docker esté corriendo**
   ```bash
   docker-compose ps  # Verificar contenedores
   ```

2. **Iniciar backend en modo dev**
   ```bash
   npm start  # Hot reload activado
   ```

3. **Hacer cambios en el código**
   - Los cambios se recargan automáticamente con nodemon

4. **Probar con cURL o Postman**
   - API: http://localhost:3000/api

### Tips de Desarrollo

**Ver logs de MongoDB:**
```bash
docker-compose logs -f mongo_db
```

**Conectarse a Neo4j Browser:**
1. Abrir http://localhost:7474
2. Login con `neo4j` / `db2passwordsecure!`
3. Ejecutar queries Cypher:

```cypher
// Ver todos los usuarios
MATCH (u:User) RETURN u LIMIT 10;

// Ver skills más comunes
MATCH (u:User)-[r:HAS_SKILL]->(s:Skill)
RETURN s.name, count(r) as users
ORDER BY users DESC;

// Ver conexiones entre usuarios
MATCH (u1:User)-[:COLLEAGUE_OF]-(u2:User)
RETURN u1, u2 LIMIT 20;
```

**Monitorear Redis:**
```bash
docker exec -it redis_db redis-cli MONITOR
```

**Limpiar cache de Redis:**
```bash
docker exec -it redis_db redis-cli FLUSHALL
```

**Reiniciar bases de datos limpiamente:**
```bash
docker-compose down -v  # Elimina volúmenes
docker-compose up -d
npm run seed           # Volver a sembrar
```

### Debugging

**Backend (VS Code):**

Crear `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/src/index.ts",
      "preLaunchTask": null,
      "outFiles": ["${workspaceFolder}/**/*.js"],
      "runtimeArgs": ["--loader", "ts-node/esm"]
    }
  ]
}
```
