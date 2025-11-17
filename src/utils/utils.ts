// Utility functions for the Talentum+ platform

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate ObjectId format (MongoDB)
export const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Calculate skill match percentage
export const calculateSkillMatch = (userSkills: string[], requiredSkills: string[]): number => {
  if (!requiredSkills.length) return 100;
  
  const userSkillsLower = userSkills.map(s => s.toLowerCase());
  const requiredSkillsLower = requiredSkills.map(s => s.toLowerCase());
  
  const matchingSkills = userSkillsLower.filter(skill => 
    requiredSkillsLower.includes(skill)
  );
  
  return Math.round((matchingSkills.length / requiredSkills.length) * 100);
};

// Generate random session ID
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

// Format date to ISO string
export const formatDate = (date: Date): string => {
  return date.toISOString();
};

// Parse query params for pagination
export const parsePaginationParams = (query: any): { page: number; limit: number; skip: number } => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
};

// Sanitize user input (basic)
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Generate match score label
export const getMatchScoreLabel = (score: number): string => {
  if (score >= 80) return 'Excellent Match';
  if (score >= 60) return 'Good Match';
  if (score >= 40) return 'Fair Match';
  return 'Low Match';
};

// Calculate experience years from date
export const calculateYearsOfExperience = (startDate: Date, endDate?: Date): number => {
  const end = endDate || new Date();
  const years = (end.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
  return Math.round(years * 10) / 10; // Round to 1 decimal
};

// Group items by property
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

// Delay function (for rate limiting, retries, etc.)
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Check if date is within range
export const isDateInRange = (date: Date, startDate: Date, endDate: Date): boolean => {
  return date >= startDate && date <= endDate;
};

// Format salary range
export const formatSalaryRange = (min: number, max: number, currency: string = 'USD'): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0
  });
  
  return `${formatter.format(min)} - ${formatter.format(max)}`;
};

// Extract unique values from array
export const unique = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

// Chunk array into smaller arrays
export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// Error handler wrapper for async routes
export const asyncHandler = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Calculate percentage
export const calculatePercentage = (part: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
};

// Generate random color (for UI)
export const generateRandomColor = (): string => {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
