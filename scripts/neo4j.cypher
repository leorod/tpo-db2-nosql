// ============================================
// 1. HABILIDADES
// ============================================

// Backend
CREATE (:Skill {nombre: 'Python', categoria: 'backend'});
CREATE (:Skill {nombre: 'Java', categoria: 'backend'});
CREATE (:Skill {nombre: 'Node.js', categoria: 'backend'});
CREATE (:Skill {nombre: 'Go', categoria: 'backend'});
CREATE (:Skill {nombre: 'Ruby', categoria: 'backend'});

// Frontend
CREATE (:Skill {nombre: 'React', categoria: 'frontend'});
CREATE (:Skill {nombre: 'Angular', categoria: 'frontend'});
CREATE (:Skill {nombre: 'Vue.js', categoria: 'frontend'});
CREATE (:Skill {nombre: 'TypeScript', categoria: 'frontend'});

// Cloud/DevOps
CREATE (:Skill {nombre: 'AWS', categoria: 'cloud'});
CREATE (:Skill {nombre: 'Docker', categoria: 'devops'});
CREATE (:Skill {nombre: 'Kubernetes', categoria: 'devops'});
CREATE (:Skill {nombre: 'Terraform', categoria: 'devops'});
CREATE (:Skill {nombre: 'Jenkins', categoria: 'devops'});

// Bases de Datos
CREATE (:Skill {nombre: 'MongoDB', categoria: 'base_datos'});
CREATE (:Skill {nombre: 'PostgreSQL', categoria: 'base_datos'});
CREATE (:Skill {nombre: 'Redis', categoria: 'base_datos'});
CREATE (:Skill {nombre: 'Neo4j', categoria: 'base_datos'});
CREATE (:Skill {nombre: 'Elasticsearch', categoria: 'base_datos'});

// Soft Skills
CREATE (:Skill {nombre: 'Liderazgo', categoria: 'soft_skill'});
CREATE (:Skill {nombre: 'Comunicación', categoria: 'soft_skill'});
CREATE (:Skill {nombre: 'Trabajo en Equipo', categoria: 'soft_skill'});
CREATE (:Skill {nombre: 'Resolución de Problemas', categoria: 'soft_skill'});

// ============================================
// 2. EMPRESAS
// ============================================

CREATE (:Empresa {
  id: 'emp_001',
  nombre: 'TechCorp Argentina',
  industria: 'fintech'
});

CREATE (:Empresa {
  id: 'emp_002',
  nombre: 'StartupIO',
  industria: 'e-commerce'
});

CREATE (:Empresa {
  id: 'emp_003',
  nombre: 'DataMinds',
  industria: 'data_science'
});

CREATE (:Empresa {
  id: 'emp_004',
  nombre: 'CloudSolutions',
  industria: 'cloud_services'
});

CREATE (:Empresa {
  id: 'emp_005',
  nombre: 'InnovaLabs',
  industria: 'software_factory'
});

// ============================================
// 3. USUARIOS - CANDIDATOS
// ============================================

CREATE (:Usuario {
  id: 'usr_001',
  nombre: 'Juan Pérez',
  email: 'juan.perez@email.com',
  tipo: 'candidato',
  titulo_actual: 'Senior Backend Engineer'
});

CREATE (:Usuario {
  id: 'usr_002',
  nombre: 'María González',
  email: 'maria.gonzalez@email.com',
  tipo: 'candidato',
  titulo_actual: 'Desarrolladora Full Stack'
});

CREATE (:Usuario {
  id: 'usr_003',
  nombre: 'Carlos Rodríguez',
  email: 'carlos.rodriguez@email.com',
  tipo: 'candidato',
  titulo_actual: 'Ingeniero DevOps'
});

CREATE (:Usuario {
  id: 'usr_004',
  nombre: 'Ana Martínez',
  email: 'ana.martinez@email.com',
  tipo: 'candidato',
  titulo_actual: 'Desarrolladora Frontend'
});

CREATE (:Usuario {
  id: 'usr_005',
  nombre: 'Luis Fernández',
  email: 'luis.fernandez@email.com',
  tipo: 'candidato',
  titulo_actual: 'Tech Lead'
});

CREATE (:Usuario {
  id: 'usr_006',
  nombre: 'Sofía Ramírez',
  email: 'sofia.ramirez@email.com',
  tipo: 'candidato',
  titulo_actual: 'Data Scientist'
});

// ============================================
// 4. USUARIOS - RECLUTADORES
// ============================================

CREATE (:Usuario {
  id: 'usr_rec_001',
  nombre: 'Laura Sánchez',
  email: 'laura.sanchez@techcorp.com',
  tipo: 'reclutador',
});

CREATE (:Usuario {
  id: 'usr_rec_002',
  nombre: 'Roberto Díaz',
  email: 'roberto.diaz@startupio.com',
  tipo: 'reclutador',
});

CREATE (:Usuario {
  id: 'usr_rec_003',
  nombre: 'Patricia López',
  email: 'patricia.lopez@cloudsolutions.cl',
  tipo: 'reclutador',
});

// ============================================
// 5. USUARIOS - INSTRUCTORES
// ============================================

CREATE (:Usuario {
  id: 'usr_inst_001',
  nombre: 'Pablo Torres',
  email: 'pablo.torres@email.com',
  tipo: 'instructor',
  especialidad: 'Backend',
});

CREATE (:Usuario {
  id: 'usr_inst_002',
  nombre: 'Gabriela Ruiz',
  email: 'gabriela.ruiz@email.com',
  tipo: 'instructor',
  especialidad: 'Frontend',
});

CREATE (:Usuario {
  id: 'usr_inst_003',
  nombre: 'Martín Silva',
  email: 'martin.silva@email.com',
  tipo: 'instructor',
  especialidad: 'DevOps',
});

// ============================================
// 6. POSICIONES
// ============================================

CREATE (:Posicion {
  id: 'pos_001',
  titulo: 'Ingeniero Backend Senior',
  descripcion: 'Desarrollo de microservicios con Python y AWS',
  modalidad: 'remoto',
  tipo_contrato: 'fulltime',
  estado: 'activa',
  salario_min: 4000,
  salario_max: 6000,
  moneda: 'USD',
  fecha_publicacion: date('2024-10-01')
});

CREATE (:Posicion {
  id: 'pos_002',
  titulo: 'Desarrollador Full Stack',
  descripcion: 'Desarrollo frontend y backend para e-commerce',
  modalidad: 'hibrido',
  tipo_contrato: 'fulltime',
  estado: 'activa',
  salario_min: 3000,
  salario_max: 4500,
  moneda: 'USD',
  fecha_publicacion: date('2024-10-15')
});

CREATE (:Posicion {
  id: 'pos_003',
  titulo: 'Ingeniero DevOps',
  descripcion: 'Gestión de infraestructura cloud y CI/CD',
  modalidad: 'remoto',
  tipo_contrato: 'fulltime',
  estado: 'activa',
  salario_min: 4500,
  salario_max: 6500,
  moneda: 'USD',
  fecha_publicacion: date('2024-11-01')
});

CREATE (:Posicion {
  id: 'pos_004',
  titulo: 'Tech Lead',
  descripcion: 'Liderazgo técnico de equipo fintech',
  modalidad: 'hibrido',
  tipo_contrato: 'fulltime',
  estado: 'activa',
  salario_min: 6000,
  salario_max: 8000,
  moneda: 'USD',
  fecha_publicacion: date('2024-10-20')
});

CREATE (:Posicion {
  id: 'pos_005',
  titulo: 'Data Scientist',
  descripcion: 'Análisis de datos y machine learning',
  modalidad: 'remoto',
  tipo_contrato: 'fulltime',
  estado: 'activa',
  salario_min: 3500,
  salario_max: 5500,
  moneda: 'USD',
  fecha_publicacion: date('2024-10-25')
});

// ============================================
// 7. CURSOS
// ============================================

CREATE (:Curso {
  id: 'cur_001',
  titulo: 'Microservicios con Node.js',
  descripcion: 'Arquitecturas de microservicios escalables',
  categoria: 'backend',
  nivel: 'intermedio',
  duracion_horas: 40,
  precio: 299.99
});

CREATE (:Curso {
  id: 'cur_002',
  titulo: 'React Avanzado',
  descripcion: 'Patrones avanzados y optimización en React',
  categoria: 'frontend',
  nivel: 'avanzado',
  duracion_horas: 35,
  precio: 349.99
});

CREATE (:Curso {
  id: 'cur_003',
  titulo: 'Kubernetes para DevOps',
  descripcion: 'Orquestación de contenedores con Kubernetes',
  categoria: 'devops',
  nivel: 'intermedio',
  duracion_horas: 50,
  precio: 399.99
});

CREATE (:Curso {
  id: 'cur_004',
  titulo: 'Python para Data Science',
  descripcion: 'Análisis de datos con Python y Pandas',
  categoria: 'data_science',
  nivel: 'principiante',
  duracion_horas: 30,
  precio: 199.99
});

CREATE (:Curso {
  id: 'cur_005',
  titulo: 'AWS Fundamentos',
  descripcion: 'Introducción a Amazon Web Services',
  categoria: 'cloud',
  nivel: 'principiante',
  duracion_horas: 25,
  precio: 249.99
});

// ============================================
// 8. RELACIONES
// ============================================

// ============================================
// 8.1 RELACIONES USUARIO-SKILL (TIENE_SKILL)
// ============================================

// Juan Pérez - Backend Engineer
MATCH (u:Usuario {id: 'usr_001'}), (s:Skill {nombre: 'Python'})
CREATE (u)-[:TIENE_SKILL {nivel: 'avanzado', años_experiencia: 5}]->(s);

MATCH (u:Usuario {id: 'usr_001'}), (s:Skill {nombre: 'Node.js'})
CREATE (u)-[:TIENE_SKILL {nivel: 'intermedio', años_experiencia: 3}]->(s);

MATCH (u:Usuario {id: 'usr_001'}), (s:Skill {nombre: 'AWS'})
CREATE (u)-[:TIENE_SKILL {nivel: 'avanzado', años_experiencia: 4}]->(s);

MATCH (u:Usuario {id: 'usr_001'}), (s:Skill {nombre: 'Docker'})
CREATE (u)-[:TIENE_SKILL {nivel: 'intermedio', años_experiencia: 3}]->(s);

// María González - Full Stack
MATCH (u:Usuario {id: 'usr_002'}), (s:Skill {nombre: 'React'})
CREATE (u)-[:TIENE_SKILL {nivel: 'avanzado', años_experiencia: 4}]->(s);

MATCH (u:Usuario {id: 'usr_002'}), (s:Skill {nombre: 'TypeScript'})
CREATE (u)-[:TIENE_SKILL {nivel: 'avanzado', años_experiencia: 3}]->(s);

MATCH (u:Usuario {id: 'usr_002'}), (s:Skill {nombre: 'Node.js'})
CREATE (u)-[:TIENE_SKILL {nivel: 'intermedio', años_experiencia: 2}]->(s);

MATCH (u:Usuario {id: 'usr_002'}), (s:Skill {nombre: 'MongoDB'})
CREATE (u)-[:TIENE_SKILL {nivel: 'intermedio', años_experiencia: 2}]->(s);

// Carlos Rodríguez - DevOps
MATCH (u:Usuario {id: 'usr_003'}), (s:Skill {nombre: 'Docker'})
CREATE (u)-[:TIENE_SKILL {nivel: 'avanzado', años_experiencia: 4}]->(s);

MATCH (u:Usuario {id: 'usr_003'}), (s:Skill {nombre: 'Kubernetes'})
CREATE (u)-[:TIENE_SKILL {nivel: 'avanzado', años_experiencia: 3}]->(s);

MATCH (u:Usuario {id: 'usr_003'}), (s:Skill {nombre: 'AWS'})
CREATE (u)-[:TIENE_SKILL {nivel: 'intermedio', años_experiencia: 3}]->(s);

MATCH (u:Usuario {id: 'usr_003'}), (s:Skill {nombre: 'Terraform'})
CREATE (u)-[:TIENE_SKILL {nivel: 'intermedio', años_experiencia: 2}]->(s);

// Ana Martínez - Frontend
MATCH (u:Usuario {id: 'usr_004'}), (s:Skill {nombre: 'React'})
CREATE (u)-[:TIENE_SKILL {nivel: 'avanzado', años_experiencia: 3}]->(s);

MATCH (u:Usuario {id: 'usr_004'}), (s:Skill {nombre: 'Angular'})
CREATE (u)-[:TIENE_SKILL {nivel: 'intermedio', años_experiencia: 2}]->(s);

MATCH (u:Usuario {id: 'usr_004'}), (s:Skill {nombre: 'TypeScript'})
CREATE (u)-[:TIENE_SKILL {nivel: 'avanzado', años_experiencia: 3}]->(s);

// Luis Fernández - Tech Lead
MATCH (u:Usuario {id: 'usr_005'}), (s:Skill {nombre: 'Java'})
CREATE (u)-[:TIENE_SKILL {nivel: 'experto', años_experiencia: 8}]->(s);

MATCH (u:Usuario {id: 'usr_005'}), (s:Skill {nombre: 'Liderazgo'})
CREATE (u)-[:TIENE_SKILL {nivel: 'avanzado', años_experiencia: 5}]->(s);

MATCH (u:Usuario {id: 'usr_005'}), (s:Skill {nombre: 'PostgreSQL'})
CREATE (u)-[:TIENE_SKILL {nivel: 'avanzado', años_experiencia: 6}]->(s);

// Sofía Ramírez - Data Scientist
MATCH (u:Usuario {id: 'usr_006'}), (s:Skill {nombre: 'Python'})
CREATE (u)-[:TIENE_SKILL {nivel: 'experto', años_experiencia: 6}]->(s);

MATCH (u:Usuario {id: 'usr_006'}), (s:Skill {nombre: 'MongoDB'})
CREATE (u)-[:TIENE_SKILL {nivel: 'intermedio', años_experiencia: 3}]->(s);

MATCH (u:Usuario {id: 'usr_006'}), (s:Skill {nombre: 'Elasticsearch'})
CREATE (u)-[:TIENE_SKILL {nivel: 'avanzado', años_experiencia: 4}]->(s);

// ============================================
// 8.2 RELACIONES EMPRESA-POSICION (PUBLICA)
// ============================================

MATCH (e:Empresa {id: 'emp_001'}), (p:Posicion {id: 'pos_001'})
CREATE (e)-[:PUBLICA {fecha_publicacion: date('2024-10-01')}]->(p);

MATCH (e:Empresa {id: 'emp_002'}), (p:Posicion {id: 'pos_002'})
CREATE (e)-[:PUBLICA {fecha_publicacion: date('2024-10-15')}]->(p);

MATCH (e:Empresa {id: 'emp_004'}), (p:Posicion {id: 'pos_003'})
CREATE (e)-[:PUBLICA {fecha_publicacion: date('2024-11-01')}]->(p);

MATCH (e:Empresa {id: 'emp_001'}), (p:Posicion {id: 'pos_004'})
CREATE (e)-[:PUBLICA {fecha_publicacion: date('2024-10-20')}]->(p);

MATCH (e:Empresa {id: 'emp_003'}), (p:Posicion {id: 'pos_005'})
CREATE (e)-[:PUBLICA {fecha_publicacion: date('2024-10-25')}]->(p);

// ============================================
// 8.3 RELACIONES POSICION-SKILL (REQUIERE)
// ============================================

// Pos_001: Ingeniero Backend Senior
MATCH (p:Posicion {id: 'pos_001'}), (s:Skill {nombre: 'Python'})
CREATE (p)-[:REQUIERE {nivel_requerido: 'avanzado', obligatorio: true}]->(s);

MATCH (p:Posicion {id: 'pos_001'}), (s:Skill {nombre: 'AWS'})
CREATE (p)-[:REQUIERE {nivel_requerido: 'intermedio', obligatorio: true}]->(s);

MATCH (p:Posicion {id: 'pos_001'}), (s:Skill {nombre: 'Docker'})
CREATE (p)-[:REQUIERE {nivel_requerido: 'intermedio', obligatorio: false}]->(s);

// Pos_002: Desarrollador Full Stack
MATCH (p:Posicion {id: 'pos_002'}), (s:Skill {nombre: 'React'})
CREATE (p)-[:REQUIERE {nivel_requerido: 'intermedio', obligatorio: true}]->(s);

MATCH (p:Posicion {id: 'pos_002'}), (s:Skill {nombre: 'Node.js'})
CREATE (p)-[:REQUIERE {nivel_requerido: 'intermedio', obligatorio: true}]->(s);

MATCH (p:Posicion {id: 'pos_002'}), (s:Skill {nombre: 'MongoDB'})
CREATE (p)-[:REQUIERE {nivel_requerido: 'básico', obligatorio: false}]->(s);

// Pos_003: Ingeniero DevOps
MATCH (p:Posicion {id: 'pos_003'}), (s:Skill {nombre: 'Kubernetes'})
CREATE (p)-[:REQUIERE {nivel_requerido: 'avanzado', obligatorio: true}]->(s);

MATCH (p:Posicion {id: 'pos_003'}), (s:Skill {nombre: 'Docker'})
CREATE (p)-[:REQUIERE {nivel_requerido: 'avanzado', obligatorio: true}]->(s);

MATCH (p:Posicion {id: 'pos_003'}), (s:Skill {nombre: 'Terraform'})
CREATE (p)-[:REQUIERE {nivel_requerido: 'intermedio', obligatorio: false}]->(s);

// Pos_004: Tech Lead
MATCH (p:Posicion {id: 'pos_004'}), (s:Skill {nombre: 'Java'})
CREATE (p)-[:REQUIERE {nivel_requerido: 'experto', obligatorio: true}]->(s);

MATCH (p:Posicion {id: 'pos_004'}), (s:Skill {nombre: 'Liderazgo'})
CREATE (p)-[:REQUIERE {nivel_requerido: 'avanzado', obligatorio: true}]->(s);

MATCH (p:Posicion {id: 'pos_004'}), (s:Skill {nombre: 'PostgreSQL'})
CREATE (p)-[:REQUIERE {nivel_requerido: 'intermedio', obligatorio: false}]->(s);

// Pos_005: Data Scientist
MATCH (p:Posicion {id: 'pos_005'}), (s:Skill {nombre: 'Python'})
CREATE (p)-[:REQUIERE {nivel_requerido: 'avanzado', obligatorio: true}]->(s);

MATCH (p:Posicion {id: 'pos_005'}), (s:Skill {nombre: 'Elasticsearch'})
CREATE (p)-[:REQUIERE {nivel_requerido: 'intermedio', obligatorio: false}]->(s);

// ============================================
// 8.4 RELACIONES USUARIO-POSICION (POSTULA, FAVORITA)
// ============================================

// Postulaciones
MATCH (u:Usuario {id: 'usr_001'}), (p:Posicion {id: 'pos_001'})
CREATE (u)-[:POSTULA {fecha_postulacion: date('2024-10-02'), estado: 'en_revision'}]->(p);

MATCH (u:Usuario {id: 'usr_001'}), (p:Posicion {id: 'pos_004'})
CREATE (u)-[:POSTULA {fecha_postulacion: date('2024-10-21'), estado: 'entrevista'}]->(p);

MATCH (u:Usuario {id: 'usr_002'}), (p:Posicion {id: 'pos_002'})
CREATE (u)-[:POSTULA {fecha_postulacion: date('2024-10-16'), estado: 'aprobado'}]->(p);

MATCH (u:Usuario {id: 'usr_003'}), (p:Posicion {id: 'pos_003'})
CREATE (u)-[:POSTULA {fecha_postulacion: date('2024-11-02'), estado: 'en_revision'}]->(p);

MATCH (u:Usuario {id: 'usr_004'}), (p:Posicion {id: 'pos_002'})
CREATE (u)-[:POSTULA {fecha_postulacion: date('2024-10-17'), estado: 'rechazado'}]->(p);

MATCH (u:Usuario {id: 'usr_005'}), (p:Posicion {id: 'pos_004'})
CREATE (u)-[:POSTULA {fecha_postulacion: date('2024-10-22'), estado: 'en_revision'}]->(p);

MATCH (u:Usuario {id: 'usr_006'}), (p:Posicion {id: 'pos_005'})
CREATE (u)-[:POSTULA {fecha_postulacion: date('2024-10-26'), estado: 'entrevista'}]->(p);

// Favoritos
MATCH (u:Usuario {id: 'usr_001'}), (p:Posicion {id: 'pos_003'})
CREATE (u)-[:FAVORITA {fecha_favorito: date('2024-11-01')}]->(p);

MATCH (u:Usuario {id: 'usr_002'}), (p:Posicion {id: 'pos_004'})
CREATE (u)-[:FAVORITA {fecha_favorito: date('2024-10-20')}]->(p);

MATCH (u:Usuario {id: 'usr_004'}), (p:Posicion {id: 'pos_001'})
CREATE (u)-[:FAVORITA {fecha_favorito: date('2024-10-05')}]->(p);

// ============================================
// 8.5 RELACIONES RECLUTADOR-EMPRESA (TRABAJA_EN)
// ============================================

MATCH (r:Usuario {id: 'usr_rec_001'}), (e:Empresa {id: 'emp_001'})
CREATE (r)-[:TRABAJA_EN {cargo: 'Senior Recruiter', fecha_inicio: date('2023-01-15')}]->(e);

MATCH (r:Usuario {id: 'usr_rec_002'}), (e:Empresa {id: 'emp_002'})
CREATE (r)-[:TRABAJA_EN {cargo: 'Head of Talent', fecha_inicio: date('2022-08-10')}]->(e);

MATCH (r:Usuario {id: 'usr_rec_003'}), (e:Empresa {id: 'emp_004'})
CREATE (r)-[:TRABAJA_EN {cargo: 'Tech Recruiter', fecha_inicio: date('2024-03-01')}]->(e);

// ============================================
// 8.6 RELACIONES INSTRUCTOR-CURSO (DICTA)
// ============================================

MATCH (i:Usuario {id: 'usr_inst_001'}), (c:Curso {id: 'cur_001'})
CREATE (i)-[:DICTA {fecha_inicio: date('2024-09-01'), activo: true}]->(c);

MATCH (i:Usuario {id: 'usr_inst_002'}), (c:Curso {id: 'cur_002'})
CREATE (i)-[:DICTA {fecha_inicio: date('2024-08-15'), activo: true}]->(c);

MATCH (i:Usuario {id: 'usr_inst_003'}), (c:Curso {id: 'cur_003'})
CREATE (i)-[:DICTA {fecha_inicio: date('2024-07-01'), activo: true}]->(c);

MATCH (i:Usuario {id: 'usr_inst_001'}), (c:Curso {id: 'cur_005'})
CREATE (i)-[:DICTA {fecha_inicio: date('2024-06-01'), activo: true}]->(c);

// ============================================
// 8.7 RELACIONES CURSO-SKILL (ENSEÑA)
// ============================================

// cur_001: Microservicios con Node.js
MATCH (c:Curso {id: 'cur_001'}), (s:Skill {nombre: 'Node.js'})
CREATE (c)-[:ENSEÑA {nivel_target: 'intermedio'}]->(s);

MATCH (c:Curso {id: 'cur_001'}), (s:Skill {nombre: 'Docker'})
CREATE (c)-[:ENSEÑA {nivel_target: 'básico'}]->(s);

// cur_002: React Avanzado
MATCH (c:Curso {id: 'cur_002'}), (s:Skill {nombre: 'React'})
CREATE (c)-[:ENSEÑA {nivel_target: 'avanzado'}]->(s);

MATCH (c:Curso {id: 'cur_002'}), (s:Skill {nombre: 'TypeScript'})
CREATE (c)-[:ENSEÑA {nivel_target: 'intermedio'}]->(s);

// cur_003: Kubernetes para DevOps
MATCH (c:Curso {id: 'cur_003'}), (s:Skill {nombre: 'Kubernetes'})
CREATE (c)-[:ENSEÑA {nivel_target: 'intermedio'}]->(s);

MATCH (c:Curso {id: 'cur_003'}), (s:Skill {nombre: 'Docker'})
CREATE (c)-[:ENSEÑA {nivel_target: 'intermedio'}]->(s);

// cur_004: Python para Data Science
MATCH (c:Curso {id: 'cur_004'}), (s:Skill {nombre: 'Python'})
CREATE (c)-[:ENSEÑA {nivel_target: 'básico'}]->(s);

// cur_005: AWS Fundamentos
MATCH (c:Curso {id: 'cur_005'}), (s:Skill {nombre: 'AWS'})
CREATE (c)-[:ENSEÑA {nivel_target: 'básico'}]->(s);

// ============================================
// 8.8 RELACIONES USUARIO-CURSO (INSCRITO, COMPLETO)
// ============================================

// Inscripciones activas
MATCH (u:Usuario {id: 'usr_001'}), (c:Curso {id: 'cur_005'})
CREATE (u)-[:INSCRITO {fecha_inscripcion: date('2024-10-01'), progreso: 60, activo: true}]->(c);

MATCH (u:Usuario {id: 'usr_002'}), (c:Curso {id: 'cur_002'})
CREATE (u)-[:INSCRITO {fecha_inscripcion: date('2024-09-15'), progreso: 85, activo: true}]->(c);

MATCH (u:Usuario {id: 'usr_003'}), (c:Curso {id: 'cur_003'})
CREATE (u)-[:INSCRITO {fecha_inscripcion: date('2024-10-10'), progreso: 30, activo: true}]->(c);

MATCH (u:Usuario {id: 'usr_004'}), (c:Curso {id: 'cur_002'})
CREATE (u)-[:INSCRITO {fecha_inscripcion: date('2024-08-20'), progreso: 45, activo: true}]->(c);

MATCH (u:Usuario {id: 'usr_006'}), (c:Curso {id: 'cur_004'})
CREATE (u)-[:INSCRITO {fecha_inscripcion: date('2024-09-01'), progreso: 90, activo: true}]->(c);

// Cursos completados
MATCH (u:Usuario {id: 'usr_001'}), (c:Curso {id: 'cur_001'})
CREATE (u)-[:COMPLETO {fecha_completado: date('2024-09-30'), calificacion: 4.5, certificado: true}]->(c);

MATCH (u:Usuario {id: 'usr_005'}), (c:Curso {id: 'cur_001'})
CREATE (u)-[:COMPLETO {fecha_completado: date('2024-08-15'), calificacion: 5.0, certificado: true}]->(c);

MATCH (u:Usuario {id: 'usr_003'}), (c:Curso {id: 'cur_005'})
CREATE (u)-[:COMPLETO {fecha_completado: date('2024-07-20'), calificacion: 4.2, certificado: true}]->(c);

// ============================================
// 8.9 RELACIONES SOCIALES ENTRE USUARIOS (SIGUE, CONECTADO)
// ============================================

// Conexiones profesionales
MATCH (u1:Usuario {id: 'usr_001'}), (u2:Usuario {id: 'usr_002'})
CREATE (u1)-[:CONECTADO {fecha_conexion: date('2024-09-15'), estado: 'aceptada'}]->(u2);

MATCH (u1:Usuario {id: 'usr_001'}), (u2:Usuario {id: 'usr_005'})
CREATE (u1)-[:CONECTADO {fecha_conexion: date('2024-08-10'), estado: 'aceptada'}]->(u2);

MATCH (u1:Usuario {id: 'usr_002'}), (u2:Usuario {id: 'usr_004'})
CREATE (u1)-[:CONECTADO {fecha_conexion: date('2024-10-01'), estado: 'aceptada'}]->(u2);

MATCH (u1:Usuario {id: 'usr_003'}), (u2:Usuario {id: 'usr_005'})
CREATE (u1)-[:CONECTADO {fecha_conexion: date('2024-09-20'), estado: 'aceptada'}]->(u2);

MATCH (u1:Usuario {id: 'usr_004'}), (u2:Usuario {id: 'usr_006'})
CREATE (u1)-[:CONECTADO {fecha_conexion: date('2024-10-05'), estado: 'pendiente'}]->(u2);

// Seguidores (para instructores y líderes)
MATCH (u1:Usuario {id: 'usr_001'}), (u2:Usuario {id: 'usr_inst_001'})
CREATE (u1)-[:SIGUE {fecha_seguimiento: date('2024-09-01')}]->(u2);

MATCH (u1:Usuario {id: 'usr_002'}), (u2:Usuario {id: 'usr_inst_002'})
CREATE (u1)-[:SIGUE {fecha_seguimiento: date('2024-08-15')}]->(u2);

MATCH (u1:Usuario {id: 'usr_003'}), (u2:Usuario {id: 'usr_inst_003'})
CREATE (u1)-[:SIGUE {fecha_seguimiento: date('2024-07-10')}]->(u2);

MATCH (u1:Usuario {id: 'usr_004'}), (u2:Usuario {id: 'usr_005'})
CREATE (u1)-[:SIGUE {fecha_seguimiento: date('2024-09-25')}]->(u2);

// ============================================
// 8.10 RELACIONES RECLUTADOR-CANDIDATO (CONTACTA)
// ============================================

MATCH (r:Usuario {id: 'usr_rec_001'}), (c:Usuario {id: 'usr_001'})
CREATE (r)-[:CONTACTA {fecha_contacto: date('2024-10-03'), motivo: 'entrevista_pos_001', estado: 'respondido'}]->(c);

MATCH (r:Usuario {id: 'usr_rec_002'}), (c:Usuario {id: 'usr_002'})
CREATE (r)-[:CONTACTA {fecha_contacto: date('2024-10-18'), motivo: 'oferta_pos_002', estado: 'aceptado'}]->(c);

MATCH (r:Usuario {id: 'usr_rec_003'}), (c:Usuario {id: 'usr_003'})
CREATE (r)-[:CONTACTA {fecha_contacto: date('2024-11-03'), motivo: 'primera_entrevista', estado: 'pendiente'}]->(c);
