// API Types and Interfaces
export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'freelancer' | 'client';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  userType: 'freelancer' | 'client';
}

export interface FreelancerProfile {
  id: string;
  userId: string;
  title: string; // Professional title/role
  overview: string; // Professional overview/bio
  skills: string | string[]; // Can be comma-separated string or array
  hourlyRate: number;
  location: string;
  languages: string[];
  education: Education[];
  experience: string; // Experience level/years
  portfolio: PortfolioItem[];
  profilePicture?: string;
  profileImage?: string; // New field from API response
  resume: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  age?: number;
  availability?: boolean;
  // Legacy fields for backward compatibility
  name?: string; 
  bio?: string;
  completionStatus: {
    basicInfo: boolean;
    skills: boolean;
    experience: boolean;
    education: boolean;
    portfolio: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear?: number;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl?: string;
  technologies: string[];
}

export interface DashboardStats {
  totalEarnings: number;
  activeProjects: number;
  completedProjects: number;
  pendingApplications: number;
  profileViews: number;
  successRate: number;
}

export interface RecentActivity {
  id: string;
  type: 'application' | 'project_update' | 'message' | 'payment';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  timeline: string;
  skills: string[];
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  clientId: string;
  freelancerId?: string;
  createdAt: string;
  updatedAt: string;
  // Additional properties for enhanced project display
  category?: string;
  location?: string;
  priority?: 'normal' | 'urgent';
  experienceLevel?: 'entry' | 'intermediate' | 'expert';
  paymentType?: 'hourly' | 'fixed';
  requiredSkills?: string[];
  applicationCount?: number;
  client?: {
    id: string;
    name: string;
    companyName?: string;
    rating?: number;
    reviewCount?: number;
    about?: string;
  };
}

export interface JobApplication {
  id: string;
  projectId: string;
  freelancerId: string;
  coverLetter: string;
  proposedRate: number;
  timeline: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
  project?: Project;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form data types for profile updates
export interface ProfileUpdateData {
  title?: string;
  overview?: string;
  skills?: string[];
  hourlyRate?: number;
  location?: string;
  languages?: string[];
}

export interface EducationFormData {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear?: number;
  description?: string;
}

export interface ExperienceFormData {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface PortfolioFormData {
  title: string;
  description: string;
  projectUrl?: string;
  technologies: string[];
}

export interface ProjectApplicationData {
  coverLetter: string;
  proposedRate: number;
  timeline: string;
}

// Client-specific types
export interface ClientProfile {
  id: string;
  userId: string;
  companyName: string;
  companySize: string;
  industry: string;
  website?: string;
  description: string;
  location: string;
  phone: string;
  profilePicture?: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  totalSpent: number;
  activeProjects: number;
  completedProjects: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClientDashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalSpent: number;
  freelancersHired: number;
  averageProjectRating: number;
}

export interface ProjectCreateData {
  title: string;
  description: string;
  budget: number;
  timeline: string;
  skills: string[];
  category: string;
  experienceLevel: 'entry' | 'intermediate' | 'expert';
  paymentType: 'hourly' | 'fixed';
  priority?: 'normal' | 'urgent';
  location?: string;
}

export interface ProjectUpdateData {
  title?: string;
  description?: string;
  budget?: number;
  timeline?: string;
  skills?: string[];
  category?: string;
  experienceLevel?: 'entry' | 'intermediate' | 'expert';
  paymentType?: 'hourly' | 'fixed';
  priority?: 'normal' | 'urgent';
  status?: 'draft' | 'active' | 'completed' | 'cancelled';
}

export interface ClientProfileUpdateData {
  companyName?: string;
  companySize?: string;
  industry?: string;
  website?: string;
  description?: string;
  location?: string;
  phone?: string;
}

export interface FreelancerSearchResult {
  id: string;
  userId: string;
  name: string;
  title: string;
  overview: string;
  skills: string[];
  hourlyRate: number;
  location: string;
  profilePicture?: string;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  successRate: number;
  languages: string[];
  availability: 'available' | 'busy' | 'unavailable';
  lastActive: string;
}

export interface FreelancerSearchFilters {
  skills?: string[];
  minRate?: number;
  maxRate?: number;
  location?: string;
  availability?: 'available' | 'busy' | 'unavailable';
  rating?: number;
  experienceLevel?: 'entry' | 'intermediate' | 'expert';
  languages?: string[];
}

export interface HireRequest {
  freelancerId: string;
  projectId: string;
  proposedRate: number;
  message: string;
  startDate: string;
  estimatedDuration: string;
}

// Client-specific types for API responses
export interface ClientProject {
  id: string;
  title: string;
  description: string;
  clientId: string;
  skillsRequired: string[];  budgetMin: number;
  budgetMax: number;
  duration: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'PENDING_COMPLETION' | 'COMPLETED' | 'CANCELLED';
  assignedTo: string | null;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  freelancer?: any;
  applications: ClientProjectApplication[];
}

export interface ClientProjectApplication {
  id: string;
  projectId: string;
  freelancerId: string;
  proposal: string;
  coverLetter: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  freelancer: {
    id: string;
    userId: string;
    age: number;
    skills: string[];
    experience: string;
    projectsCompleted: number;
    ratings: number;
    hourlyRate: number;
    availability: boolean;
    githubUrl: string;
    linkedinUrl: string;
    portfolioUrl: string;
    isVerified: boolean;
    user: {
      name: string;
      email: string;
      profileImage: string;
      bio: string;
      location: string;
    };
  };
  project: {
    id: string;
    title: string;
    description: string;
    skillsRequired: string[];
    budgetMin: number;
    budgetMax: number;
    status: string;
  };
}

export interface ClientProjectsResponse {
  success: boolean;
  data: {
    projects: ClientProject[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  skillsRequired: string;
  budgetMin: number;
  budgetMax: number;
  duration: string;
}

export interface ClientDashboardStats {
  totalProjects: number;
  openProjects: number;
  assignedProjects: number;
  completedProjects: number;
  pendingApplications: number;
}

export interface ClientDashboardResponse {
  success: boolean;
  data: {
    client: {
      id: string;
      userId: string;
      companyName: string;
      industry: string;
      projectsPosted: number;
      ratings: number;
      website: string;
      isVerified: boolean;
      projects: ClientProject[];
    };
    stats: ClientDashboardStats;
  };
}

// Client Applications API Types
export interface ClientApplicationsResponse {
  success: boolean;
  data: {
    applications: ClientProjectApplication[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Public Freelancer API Types
export interface PublicFreelancer {
  id: string;
  profile: {
    name: string;
    profileImage: string | null;
    bio: string | null;
    location: string | null;
    memberSince: string;
  };
  skills: string[];
  experience: string | null;
  projectsCompleted: number;
  ratings: number;
  hourlyRate: number | null;
  availability: boolean;
  portfolioLinks: {
    github: string | null;
    linkedin: string | null;
    portfolio: string | null;
  };
  completedProjects: {
    title: string;
    completedAt: string;
    client: {
      name: string;
      company: string;
    };
  }[];
}

// Client-side freelancer with email access
export interface ClientFreelancer {
  id: string;
  userId: string;
  age: number;
  skills: string[];
  experience: string;
  projectsCompleted: number;
  ratings: number;
  hourlyRate: number;
  availability: boolean;
  githubUrl: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  isVerified: boolean;
  user: {
    name: string;
    email: string;
    profileImage: string | null;
    bio: string;
    location: string;
    createdAt: string;
  };
}

export interface PublicJob {
  id: string;
  title: string;
  description: string;
  skillsRequired: string[];
  budget: {
    min: number;
    max: number;
  };
  duration: string;
  postedAt: string;
  applicationsCount: number;
  client: {
    name: string;
    company: string;
    industry: string;
    location: string;
    profileImage: string | null;
    ratings: number;
  };
}

export interface FreelancerProfileResponse {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'FREELANCER';
  profileImage: string | null;
  bio: string | null;
  location: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  freelancer: {
    id: string;
    userId: string;
    age: number;
    skills: string[];
    experience: string;
    projectsCompleted: number;
    ratings: number;
    hourlyRate: number;
    availability: boolean;
    githubUrl: string | null;
    linkedinUrl: string | null;
    portfolioUrl: string | null;
    isVerified: boolean;
  };
}

export interface ClientProfileResponse {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'CLIENT';
  profileImage: string | null;
  bio: string | null;
  location: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  client?: {
    id: string;
    userId: string;
    companyName: string | null;
    industry: string | null;
    companySize: string | null;
    website: string | null;
    isVerified: boolean;
  };
}

// Project Application Types
export interface ProjectApplicationRequest {
  proposal: string;
  coverLetter: string;
}

export interface ProjectApplicationResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    projectId: string;
    freelancerId: string;
    proposal: string;
    coverLetter: string;
    status: 'pending' | 'accepted' | 'rejected';
    appliedAt: string;
  };
}

// Assigned Projects Types
export interface AssignedProject {
  id: string;
  title: string;
  description: string;
  clientId: string;
  skillsRequired: string[];
  budgetMin: number;
  budgetMax: number;
  duration: string;
  status: 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  assignedTo: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  client: {
    id: string;
    userId: string;
    companyName: string;
    industry: string;
    projectsPosted: number;
    ratings: number;
    website: string;
    isVerified: boolean;
    user: {
      name: string;
      email: string;
      profileImage: string | null;
    };
  };
}

export interface AssignedProjectsResponse {
  success: boolean;
  data: {
    projects: AssignedProject[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Freelancer Applications Types
export interface FreelancerApplication {
  id: string;
  projectId: string;
  freelancerId: string;
  proposal: string;
  coverLetter: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  project: {
    id: string;
    title: string;
    description: string;
    clientId: string;
    skillsRequired: string[];
    budgetMin: number;
    budgetMax: number;
    duration: string;
    status: string;
    assignedTo: string | null;
    isFeatured: boolean;
    createdAt: string;
    updatedAt: string;
    client: {
      id: string;
      userId: string;
      companyName: string;
      industry: string;
      projectsPosted: number;
      ratings: number;
      website: string;
      isVerified: boolean;
      user: {
        name: string;
        email: string;
        profileImage: string | null;
      };
    };
  };
}

export interface FreelancerApplicationsResponse {
  success: boolean;
  data: {
    applications: FreelancerApplication[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Public Jobs Types (updated to match API response)
export interface PublicJobClient {
  name: string;
  company: string;
  industry: string;
  location: string;
  profileImage: string | null;
  ratings: number;
}

export interface PublicJobBudget {
  min: number;
  max: number;
}

export interface PublicJobItem {
  id: string;
  title: string;
  description: string;
  skillsRequired: string[];
  budget: PublicJobBudget;
  duration: string;
  postedAt: string;
  applicationsCount: number;
  client: PublicJobClient;
}

export interface PublicJobsResponse {
  success: boolean;
  data: {
    jobs: PublicJobItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Featured Projects and Freelancers Types
export interface FeaturedProject {
  id: string;
  title: string;
  description: string;
  skillsRequired: string[];
  budget: {
    min: number;
    max: number;
  };
  duration: string;
  postedAt: string;
  applicationsCount: number;
  averageFreelancerRating: number;
  client: {
    name: string;
    company: string;
    industry: string;
    location: string;
    profileImage: string | null;
    ratings: number;
  };
}

export interface FeaturedFreelancer {
  id: string;
  profile: {
    name: string;
    profileImage: string | null;
    bio: string;
    location: string;
    memberSince: string;
  };
  skills: string[];
  experience: string;
  projectsCompleted: number;
  ratings: number;
  hourlyRate: number;
  portfolioLinks: {
    github: string;
    linkedin: string;
    portfolio: string;
  };
  recentProjects: {
    title: string;
    completedAt: string;
    client: {
      name: string;
      company: string;
    };
  }[];
}

export interface FeaturedProjectsResponse {
  success: boolean;
  data: FeaturedProject[];
}

export interface FeaturedFreelancersResponse {
  success: boolean;
  data: FeaturedFreelancer[];
}
