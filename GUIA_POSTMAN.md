# 🚀 Guía de Prueba con Postman - Talentum+

## 📥 Importar la Colección

1. Abre Postman
2. Click en **Import** (arriba a la izquierda)
3. Selecciona el archivo `Talentum_Postman_Collection.json`
4. ¡Listo! Tendrás todos los endpoints organizados

---

## 🎯 Flujo de Prueba Completo (Paso a Paso)

### PASO 1: Verificar que el servidor funciona ✅

**Request:**
```
GET http://localhost:3000/api/health
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Talentum+ API is running",
  "timestamp": "2025-11-17T..."
}
```

---

### PASO 2: Crear una Empresa 🏢

**Request:**
```
POST http://localhost:3000/api/companies
Content-Type: application/json

{
  "name": "TechCorp Solutions",
  "industry": "Technology",
  "description": "Empresa líder en desarrollo de software",
  "website": "https://techcorp.com",
  "foundedYear": 2015,
  "size": "200-500",
  "location": "Buenos Aires, Argentina"
}
```

**⚠️ IMPORTANTE:** Guarda el `_id` de la respuesta, lo necesitarás para crear ofertas laborales.

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "_id": "674d8e9f1234567890abcdef",  // ← COPIA ESTE ID
    "name": "TechCorp Solutions",
    ...
  }
}
```

---

### PASO 3: Crear un Usuario (Candidato) 👤

**Request:**
```
POST http://localhost:3000/api/users
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

**⚠️ IMPORTANTE:** Guarda el `_id` del usuario.

---

### PASO 4: Crear una Oferta Laboral 💼

**Request:**
```
POST http://localhost:3000/api/jobs
Content-Type: application/json

{
  "title": "Senior Full-Stack Developer",
  "companyId": "674d8e9f1234567890abcdef",  // ← USA EL ID DE LA EMPRESA
  "description": "Buscamos un desarrollador full-stack senior",
  "requirements": [
    "5+ años de experiencia",
    "React y Node.js",
    "MongoDB"
  ],
  "location": "Buenos Aires, Argentina (Híbrido)",
  "salaryRange": {
    "min": 3500,
    "max": 5500,
    "currency": "USD"
  },
  "type": "Full-time",
  "level": "Senior",
  "requiredSkills": ["JavaScript", "React", "Node.js", "MongoDB"],
  "isActive": true
}
```

**⚠️ IMPORTANTE:** Guarda el `_id` de la oferta.

---

### PASO 5: Aplicar a la Oferta 📝

**Request:**
```
POST http://localhost:3000/api/applications
Content-Type: application/json

{
  "userId": "674d8e9f1234567890abcdef",     // ← ID DEL USUARIO
  "jobPostingId": "674d8e9f1234567890fedcba" // ← ID DE LA OFERTA
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "userId": "...",
    "jobPostingId": "...",
    "status": "Applied",
    "matchScore": 85,  // ← SCORE CALCULADO AUTOMÁTICAMENTE
    ...
  },
  "matchScore": 85
}
```

🎉 **¡El sistema calculó automáticamente que el candidato tiene un 85% de match!**

---

### PASO 6: Ver Ofertas Activas 👀

**Request:**
```
GET http://localhost:3000/api/jobs
```

**Tip:** La primera vez consultará MongoDB, las siguientes veces usará la caché de Redis.

---

### PASO 7: Ver Candidatos que Matchean con una Oferta 🎯

**Request:**
```
GET http://localhost:3000/api/matching/job/674d8e9f1234567890fedcba/candidates?limit=10
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "mongoResults": [
      {
        "user": { ... },
        "matchScore": 85
      }
    ],
    "neo4jResults": [
      {
        "userId": "...",
        "name": "Juan Pérez",
        "matchingSkills": 3,
        "skills": ["JavaScript", "React", "Node.js"],
        "matchScore": 75
      }
    ]
  }
}
```

---

### PASO 8: Obtener Recomendaciones para un Usuario 💡

**Request:**
```
GET http://localhost:3000/api/recommendations/user/674d8e9f1234567890abcdef/jobs?limit=10
```

**Respuesta:** Jobs recomendados basados en:
- Skills del usuario
- Historial de aplicaciones
- Red de contactos (Neo4j)

---

## 🎓 Usar el Script de Seed

Si quieres tener datos de ejemplo rápidamente:

```bash
npm run seed
```

Esto creará automáticamente:
- 3 empresas
- 3 usuarios
- 3 ofertas laborales
- 3 cursos
- Aplicaciones de ejemplo
- Relaciones en Neo4j

Después puedes:
```
GET http://localhost:3000/api/users
GET http://localhost:3000/api/jobs
GET http://localhost:3000/api/companies
```

---

## 🔍 Endpoints Importantes para Probar

### Ver Estadísticas de un Usuario
```
GET http://localhost:3000/api/users/{userId}/stats
```

### Ver Aplicaciones de un Usuario
```
GET http://localhost:3000/api/applications/user/{userId}
```

### Ver Historial de Aplicaciones (Neo4j)
```
GET http://localhost:3000/api/analytics/user/{userId}/history
```

### Encontrar Colegas (trabajaron en la misma empresa)
```
GET http://localhost:3000/api/network/{userId}/colleagues
```

---

## 🎨 Tips de Postman

### 1. Usar Variables
Después de crear un usuario/empresa/job, copia el `_id` y créalo como variable:

1. En Postman, ve a **Environments**
2. Crea un nuevo environment "Talentum Local"
3. Agrega variables:
   - `userId` = el ID del usuario
   - `companyId` = el ID de la empresa
   - `jobId` = el ID del job

Luego puedes usarlas en los requests como `{{userId}}`

### 2. Scripts Post-Request
Puedes agregar scripts para auto-guardar los IDs:

```javascript
// En la pestaña "Tests" del request POST /users
pm.test("Save userId", function () {
    var jsonData = pm.response.json();
    pm.environment.set("userId", jsonData.data._id);
});
```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to MongoDB"
```bash
docker ps  # Verificar que los contenedores estén corriendo
docker-compose up -d  # Si no están corriendo
```

### Error: "User already exists"
Cambia el email en el request, debe ser único.

### El servidor no responde
```bash
npm start  # Asegúrate de que el servidor esté corriendo
```

### Ver logs del servidor
Si usaste `npm start`, los logs aparecen en la terminal.

---

## 🚀 Flujo Avanzado

### 1. Crear múltiples usuarios con diferentes skills
### 2. Crear varias ofertas
### 3. Hacer que usuarios apliquen a diferentes ofertas
### 4. Ver el matching en Neo4j Browser:

```
http://localhost:7474
Usuario: neo4j
Password: db2passwordsecure!
```

**Query de ejemplo:**
```cypher
MATCH (u:User)-[app:APPLIED_FOR]->(j:JobPosting)<-[:POSTED]-(c:Company)
RETURN u.name, j.title, c.name, app.matchScore
```

---

## 📊 Verificar las 3 Bases de Datos

### MongoDB
Usa MongoDB Compass:
```
mongodb://mongodb:db2passwordsecure!@localhost:27017
```

### Neo4j
Browser:
```
http://localhost:7474
```

Query para ver el grafo:
```cypher
MATCH (n) RETURN n LIMIT 25
```

### Redis
CLI:
```bash
docker exec -it redis_db redis-cli
KEYS *
GET "user:674d8e9f1234567890abcdef"
```

---

¡Listo! Con esta guía puedes probar toda la funcionalidad de Talentum+ 🎉

