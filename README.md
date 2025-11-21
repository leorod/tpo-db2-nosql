# 🔧 Talentum+ Backend

Backend API para la plataforma Talentum+ - Sistema de desarrollo profesional y matching laboral.

## 📖 Documentación Completa

Para documentación completa del proyecto (instalación, arquitectura, bases de datos, etc.), ver el [README principal](../README.md).

---

## 🚀 Quick Start

### 1. Levantar Bases de Datos

```bash
docker-compose up -d
```

### 2. Configurar Variables de Entorno

Crear archivo `.env`:

```env
PORT=3000
NODE_ENV=development

MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=db2passwordsecure!
MONGO_DB=talentum_db
MONGO_URI=mongodb://admin:db2passwordsecure!@localhost:27017/talentum_db?authSource=admin

NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=db2passwordsecure!

REDIS_URI=redis://localhost:6379
```

### 3. Instalar y Ejecutar

```bash
npm install
npm run seed
npm start
```

**API disponible en:** http://localhost:3000/api

---

## 📜 Scripts Disponibles

```bash
npm start              # Iniciar servidor con hot reload
npm run build          # Compilar TypeScript
npm run seed           # Sembrar base de datos
npm run check          # Verificar datos en DBs
npm run test-connection # Probar conexiones
npm run clean          # Limpiar todas las DBs
npm run diagnose       # Diagnosticar problemas
```

---

## 🗂️ Estructura

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # Conexiones a MongoDB, Neo4j, Redis
│   ├── controllers/
│   │   └── dbControllers.ts     # Lógica de negocio y endpoints
│   ├── models/
│   │   └── mongodb/
│   │       └── mongodbModel.ts  # Schemas de Mongoose
│   ├── routes/
│   │   └── routes.ts            # Definición de rutas API
│   ├── services/
│   │   ├── mongodb/
│   │   │   └── mongodbService.ts  # Operaciones MongoDB
│   │   ├── neo4j/
│   │   │   └── neoService.ts      # Operaciones Neo4j
│   │   └── redis/
│   │       └── redisService.ts    # Operaciones Redis
│   ├── utils/
│   │   ├── seed.ts              # Script de seed
│   │   └── utils.ts             # Utilidades
│   └── index.ts                 # Entry point
├── scripts/
│   ├── modelo-mongo.json        # Modelo de datos MongoDB
│   └── neo4j.cypher            # Queries Neo4j de ejemplo
├── docker-compose.yml           # Definición de servicios Docker
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🛢️ Bases de Datos

### MongoDB (Puerto 27017)
**Uso:** Almacenamiento de documentos (usuarios, empresas, trabajos, cursos)

**Acceso:**
- URI: `mongodb://admin:db2passwordsecure!@localhost:27017/talentum_db?authSource=admin`
- Con MongoDB Compass: Conectar usando la URI

**Colecciones:**
- `users` - Perfiles de usuarios
- `companies` - Empresas
- `jobpostings` - Ofertas de trabajo
- `courses` - Cursos
- `applications` - Aplicaciones a trabajos
- `enrollments` - Inscripciones a cursos
- `certifications` - Certificaciones

### Neo4j (Puertos 7474, 7687)
**Uso:** Relaciones y grafos (conexiones, recomendaciones, matching)

**Acceso:**
- Browser: http://localhost:7474
- Usuario: `neo4j`
- Contraseña: `db2passwordsecure!`

**Nodos:** User, Company, Skill, Course

**Relaciones:** WORKS_AT, HAS_SKILL, APPLIED_TO, ENROLLED_IN, REQUIRES_SKILL, TEACHES_SKILL, COLLEAGUE_OF, MENTORS, RECOMMENDS

### Redis (Puerto 6379)
**Uso:** Cache de consultas frecuentes

**Acceso:**
```bash
docker exec -it redis_db redis-cli
```

**Patrones de cache:**
- `user:*` - Datos de usuarios
- `job:*` - Ofertas de trabajo
- `company:*` - Empresas
- `stats:*` - Estadísticas

---

## 🛣️ API Endpoints

### Health
- `GET /api/health` - Health check

### Users
- `POST /api/users` - Crear usuario
- `GET /api/users` - Listar usuarios
- `GET /api/users/:userId` - Obtener usuario
- `PUT /api/users/:userId` - Actualizar usuario
- `GET /api/users/:userId/stats` - Estadísticas

### Companies
- `POST /api/companies` - Crear empresa
- `GET /api/companies` - Listar empresas

### Jobs
- `POST /api/jobs` - Crear oferta
- `GET /api/jobs` - Listar ofertas
- `GET /api/jobs/:jobId` - Obtener oferta
- `GET /api/matching/job/:jobId/candidates` - Candidatos matching

### Applications
- `POST /api/applications` - Aplicar a trabajo
- `GET /api/applications/user/:userId` - Aplicaciones de usuario
- `GET /api/applications/job/:jobId` - Aplicaciones de trabajo
- `PUT /api/applications/:applicationId/status` - Actualizar estado
- `POST /api/applications/:applicationId/interviews` - Agregar entrevista
- `GET /api/applications/:applicationId/interviews` - Ver entrevistas
- `PUT /api/applications/:applicationId/interviews/:index` - Actualizar entrevista

### Courses
- `POST /api/courses` - Crear curso
- `GET /api/courses` - Listar cursos
- `POST /api/courses/enroll` - Inscribirse
- `PUT /api/courses/:userId/:courseId/progress` - Actualizar progreso
- `PUT /api/courses/:userId/:courseId/score` - Actualizar puntaje
- `GET /api/courses/user/:userId` - Cursos de usuario
- `GET /api/courses/:userId/scores` - Puntajes

### Recommendations
- `GET /api/recommendations/user/:userId/jobs` - Jobs recomendados
- `GET /api/recommendations/user/:userId/courses` - Cursos recomendados

### Certifications
- `POST /api/certifications` - Crear certificación
- `GET /api/certifications/user/:userId` - Certificaciones de usuario
- `GET /api/certifications/user/:userId/active` - Certificaciones activas
- `GET /api/certifications/:certificationId` - Obtener certificación
- `PUT /api/certifications/:certificationId` - Actualizar certificación
- `DELETE /api/certifications/:certificationId` - Eliminar certificación
- `GET /api/certifications/skill/:skill` - Por skill

### Network
- `GET /api/network/:userId/colleagues` - Obtener colegas
- `POST /api/network/recommend` - Agregar recomendación
- `POST /api/network/mentorship` - Crear mentoría

### Analytics
- `GET /api/analytics/user/:userId/history` - Historial de aplicaciones
- `GET /api/analytics/user/:userId/activity` - Actividad reciente

---

## 🔧 Desarrollo

### Hot Reload
El servidor se recarga automáticamente al detectar cambios en archivos `.ts`.

### Debug con VS Code

`.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "program": "${workspaceFolder}/backend/src/index.ts",
      "runtimeArgs": ["--loader", "ts-node/esm"],
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

### Ver Logs de Docker
```bash
docker-compose logs -f
docker-compose logs -f mongo_db
docker-compose logs -f neo4j_db
docker-compose logs -f redis_db
```

### Conectarse a Bases de Datos

**MongoDB:**
```bash
docker exec -it mongo_db mongosh \
  -u admin \
  -p db2passwordsecure! \
  --authenticationDatabase admin \
  talentum_db
```

**Neo4j:**
- Abrir http://localhost:7474
- Login: `neo4j` / `db2passwordsecure!`

**Redis:**
```bash
docker exec -it redis_db redis-cli
# Commands: KEYS *, GET key, FLUSHALL
```

---

## 🧪 Testing y Debugging

### Verificar Conexiones
```bash
npm run test-connection
```

### Verificar Datos
```bash
npm run check
```

### Diagnosticar Problemas
```bash
npm run diagnose
```

### Limpiar y Reseed
```bash
npm run clean
npm run seed
```

---

## 🐛 Troubleshooting

### Problema: Contenedores no inician
```bash
docker-compose down -v
docker-compose up -d
```

### Problema: Error de autenticación MongoDB
Asegurarse que `.env` y `docker-compose.yml` tienen las mismas credenciales.

### Problema: Neo4j no responde
Esperar 30 segundos después de `docker-compose up` para que Neo4j termine de iniciar.

### Problema: Puerto 3000 en uso
Cambiar `PORT` en `.env` o matar proceso:
```bash
lsof -i :3000
kill -9 <PID>
```

---

## 📚 Recursos

- [MongoDB Docs](https://www.mongodb.com/docs/)
- [Neo4j Cypher](https://neo4j.com/docs/cypher-manual/)
- [Redis Commands](https://redis.io/commands/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)

---

## 🎯 Ejemplos de Queries

### MongoDB (mongosh)
```javascript
// Contar usuarios
db.users.countDocuments()

// Buscar usuario por email
db.users.findOne({ email: "juan.perez@example.com" })

// Trabajos por empresa
db.jobpostings.find({ "company.name": "TechCorp Solutions" })
```

### Neo4j (Cypher)
```cypher
// Ver todos los usuarios
MATCH (u:User) RETURN u LIMIT 10;

// Skills más demandadas
MATCH (j:JobPosting)-[:REQUIRES_SKILL]->(s:Skill)
RETURN s.name, count(j) as demand
ORDER BY demand DESC;

// Colegas de un usuario
MATCH (u:User {id: 'USER_ID'})-[:COLLEAGUE_OF]-(colleague)
RETURN colleague;
```

### Redis (redis-cli)
```bash
# Ver todas las keys
KEYS *

# Ver cache de usuario
GET user:USER_ID

# Ver estadísticas
GET stats:USER_ID

# Limpiar todo
FLUSHALL
```

---

## 📦 Dependencias Principales

```json
{
  "express": "^5.1.0",        // Web framework
  "mongoose": "^8.19.2",      // MongoDB ODM
  "neo4j-driver": "^6.0.0",   // Neo4j driver
  "redis": "^5.9.0",          // Redis client
  "dotenv": "^17.2.3",        // Variables de entorno
  "typescript": "^5.9.3",     // TypeScript
  "ts-node": "^10.9.2",       // TypeScript execution
  "nodemon": "^3.1.10"        // Hot reload
}
```

---

Para más información, consultar el [README principal del proyecto](../README.md).

**Stack:** Node.js + TypeScript + Express + MongoDB + Neo4j + Redis
