import mongoose, { Schema, Document } from 'mongoose';

// User (Candidatos/Empleados)
export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  currentRole?: string;
  isEmployee: boolean;
  skills: Array<{
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    yearsOfExperience?: number;
  }>;
  experience: Array<{
    company: string;
    role: string;
    startDate: Date;
    endDate?: Date;
    description?: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    graduationYear?: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  location: { type: String },
  bio: { type: String },
  currentRole: { type: String },
  isEmployee: { type: Boolean, default: false },
  skills: [{
    name: { type: String, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], required: true },
    yearsOfExperience: { type: Number }
  }],
  experience: [{
    company: { type: String, required: true },
    role: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    description: { type: String }
  }],
  education: [{
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    field: { type: String, required: true },
    graduationYear: { type: Number }
  }]
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', userSchema);


// Company (Empresas)
export interface ICompany extends Document {
  name: string;
  industry: string;
  description?: string;
  website?: string;
  foundedYear?: number;
  size?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>({
  name: { type: String, required: true },
  industry: { type: String, required: true },
  description: { type: String },
  website: { type: String },
  foundedYear: { type: Number },
  size: { type: String },
  location: { type: String }
}, { timestamps: true });

export const Company = mongoose.model<ICompany>('Company', companySchema);


// JobPosting (Ofertas Laborales)
export interface IJobPosting extends Document {
  title: string;
  companyId: mongoose.Types.ObjectId;
  description: string;
  requirements: string[];
  location: string;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  level: 'Junior' | 'Mid' | 'Senior' | 'Lead';
  requiredSkills: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const jobPostingSchema = new Schema<IJobPosting>({
  title: { type: String, required: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  location: { type: String, required: true },
  salaryRange: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'USD' }
  },
  type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Freelance'], required: true },
  level: { type: String, enum: ['Junior', 'Mid', 'Senior', 'Lead'], required: true },
  requiredSkills: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const JobPosting = mongoose.model<IJobPosting>('JobPosting', jobPostingSchema);


// Application (Postulaciones)
export interface IApplication extends Document {
  userId: mongoose.Types.ObjectId;
  jobPostingId: mongoose.Types.ObjectId;
  status: 'Applied' | 'Preselection' | 'Interview' | 'Technical' | 'Offer' | 'Hired' | 'Rejected';
  appliedAt: Date;
  interviews: Array<{
    type: 'HR' | 'Technical' | 'Cultural' | 'Final';
    date: Date;
    feedback?: string;
    confidentialNotes?: string;
    score?: number;
  }>;
  matchScore?: number; // Score de matching automático
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  jobPostingId: { type: Schema.Types.ObjectId, ref: 'JobPosting', required: true },
  status: { 
    type: String, 
    enum: ['Applied', 'Preselection', 'Interview', 'Technical', 'Offer', 'Hired', 'Rejected'],
    default: 'Applied'
  },
  appliedAt: { type: Date, default: Date.now },
  interviews: [{
    type: { type: String, enum: ['HR', 'Technical', 'Cultural', 'Final'], required: true },
    date: { type: Date, required: true },
    feedback: { type: String },
    confidentialNotes: { type: String },
    score: { type: Number, min: 0, max: 10 }
  }],
  matchScore: { type: Number, min: 0, max: 100 },
  rejectionReason: { type: String }
}, { timestamps: true });

export const Application = mongoose.model<IApplication>('Application', applicationSchema);


// Course (Cursos)
export interface ICourse extends Document {
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // en horas
  url?: string;
  materials: Array<{
    type: 'Video' | 'PDF' | 'Document' | 'Link';
    title: string;
    url: string;
  }>;
  skills: string[]; // Skills que enseña el curso
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  duration: { type: Number, required: true },
  url: { type: String },
  materials: [{
    type: { type: String, enum: ['Video', 'PDF', 'Document', 'Link'], required: true },
    title: { type: String, required: true },
    url: { type: String, required: true }
  }],
  skills: [{ type: String }]
}, { timestamps: true });

export const Course = mongoose.model<ICourse>('Course', courseSchema);


// LearningPath (Progreso en cursos)
export interface ILearningPath extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  status: 'Enrolled' | 'In Progress' | 'Completed' | 'Dropped';
  progressPercentage: number;
  score?: number;
  enrolledAt: Date;
  completedAt?: Date;
  lastAccessedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const learningPathSchema = new Schema<ILearningPath>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  status: { type: String, enum: ['Enrolled', 'In Progress', 'Completed', 'Dropped'], default: 'Enrolled' },
  progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
  score: { type: Number, min: 0, max: 100 },
  enrolledAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  lastAccessedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const LearningPath = mongoose.model<ILearningPath>('LearningPath', learningPathSchema);


// Certification (Certificaciones)
export interface ICertification extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  issuedBy: string;
  issuedDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
  skills: string[]; // Skills que certifica
  createdAt: Date;
  updatedAt: Date;
}

const certificationSchema = new Schema<ICertification>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  issuedBy: { type: String, required: true },
  issuedDate: { type: Date, required: true },
  expiryDate: { type: Date },
  credentialId: { type: String },
  credentialUrl: { type: String },
  skills: [{ type: String }]
}, { timestamps: true });

export const Certification = mongoose.model<ICertification>('Certification', certificationSchema);
