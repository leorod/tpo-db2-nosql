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