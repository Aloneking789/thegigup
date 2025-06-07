import { apiClient, apiClientMultipart } from './config';
import { 
  FreelancerProfile,
  ProfileUpdateData,
  EducationFormData,
  ExperienceFormData,
  PortfolioFormData,
  Education,
  Experience,
  PortfolioItem,
  ApiResponse 
} from './types';

// Freelancer Profile Service
export const freelancerService = {
  // Get freelancer profile
  getProfile: async (): Promise<FreelancerProfile> => {
    console.log('Fetching freelancer profile...');
    const response = await apiClient.get<ApiResponse<FreelancerProfile>>('/freelancer/profile');
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message);
  },
  // Create freelancer profile
  createProfile: async (profileData: any): Promise<FreelancerProfile> => {
    console.log(profileData);
    console.log('Creating freelancer profile...');
    const response = await apiClient.put<ApiResponse<FreelancerProfile>>('/freelancer/profile', profileData);
    console.log(response.data);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message);
  },

  // Update freelancer profile
  updateProfile: async (profileData: any): Promise<FreelancerProfile> => {
    const response = await apiClient.put<ApiResponse<FreelancerProfile>>('/freelancer/profile', profileData);
    console.log(response.data);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message);
  },

  // Upload profile picture
  uploadProfilePicture: async (file: File): Promise<{ profilePicture: string }> => {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await apiClientMultipart.post<ApiResponse<{ profilePicture: string }>>(
      '/freelancer/profile/picture',
      formData
    );
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message);
  },

  // Upload resume
  uploadResume: async (file: File): Promise<{ resume: string }> => {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await apiClientMultipart.post<ApiResponse<{ resume: string }>>(
      '/freelancer/profile/resume',
      formData
    );
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message);
  },

  // Education Management
  addEducation: async (educationData: EducationFormData): Promise<Education> => {
    const response = await apiClient.post<ApiResponse<Education>>('/freelancer/education', educationData);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message);
  },

  updateEducation: async (id: string, educationData: EducationFormData): Promise<Education> => {
    const response = await apiClient.put<ApiResponse<Education>>(`/freelancer/education/${id}`, educationData);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message);
  },

  deleteEducation: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/freelancer/education/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  },

  // Experience Management
  addExperience: async (experienceData: ExperienceFormData): Promise<Experience> => {
    const response = await apiClient.post<ApiResponse<Experience>>('/freelancer/experience', experienceData);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message);
  },

  updateExperience: async (id: string, experienceData: ExperienceFormData): Promise<Experience> => {
    const response = await apiClient.put<ApiResponse<Experience>>(`/freelancer/experience/${id}`, experienceData);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message);
  },

  deleteExperience: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/freelancer/experience/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  },

  // Portfolio Management
  addPortfolioItem: async (portfolioData: PortfolioFormData, image?: File): Promise<PortfolioItem> => {
    if (image) {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('title', portfolioData.title);
      formData.append('description', portfolioData.description);
      if (portfolioData.projectUrl) {
        formData.append('projectUrl', portfolioData.projectUrl);
      }
      formData.append('technologies', JSON.stringify(portfolioData.technologies));

      const response = await apiClientMultipart.post<ApiResponse<PortfolioItem>>(
        '/freelancer/portfolio',
        formData
      );
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error(response.data.message);
    } else {
      const response = await apiClient.post<ApiResponse<PortfolioItem>>('/freelancer/portfolio', portfolioData);
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error(response.data.message);
    }
  },

  updatePortfolioItem: async (id: string, portfolioData: PortfolioFormData, image?: File): Promise<PortfolioItem> => {
    if (image) {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('title', portfolioData.title);
      formData.append('description', portfolioData.description);
      if (portfolioData.projectUrl) {
        formData.append('projectUrl', portfolioData.projectUrl);
      }
      formData.append('technologies', JSON.stringify(portfolioData.technologies));

      const response = await apiClientMultipart.put<ApiResponse<PortfolioItem>>(
        `/freelancer/portfolio/${id}`,
        formData
      );
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error(response.data.message);
    } else {
      const response = await apiClient.put<ApiResponse<PortfolioItem>>(`/freelancer/portfolio/${id}`, portfolioData);
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error(response.data.message);
    }
  },

  deletePortfolioItem: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/freelancer/portfolio/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  },

  // Get profile completion status
  getProfileCompletion: async (): Promise<{ completionStatus: FreelancerProfile['completionStatus'] }> => {
    const response = await apiClient.get<ApiResponse<{ completionStatus: FreelancerProfile['completionStatus'] }>>(
      '/freelancer/profile/completion'
    );
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message);
  },
};
