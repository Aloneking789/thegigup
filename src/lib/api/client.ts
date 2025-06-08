// Client API Service
import { API_CONFIG, getApiUrl, getCurrentToken } from '../config/api';
import { 
  ClientProjectsResponse, 
  ClientDashboardResponse, 
  CreateProjectRequest,
  ApiResponse,
  PublicFreelancer,
  PublicJob,
  ClientProfileResponse,
  FreelancerProfileResponse,
  ProjectApplicationRequest,
  ProjectApplicationResponse,
  AssignedProjectsResponse,
  FreelancerApplicationsResponse,
  PublicJobsResponse,
  FeaturedProjectsResponse,
  FeaturedFreelancersResponse
} from './types';

export class ClientService {
  private getAuthHeaders() {
    const token = getCurrentToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private getAuthHeadersMultipart() {
    const token = getCurrentToken();
    return {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  async getProjects(): Promise<ClientProjectsResponse> {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CLIENT.PROJECTS), {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    return response.json();
  }

  async createProject(projectData: CreateProjectRequest): Promise<ApiResponse<any>> {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CLIENT.PROJECTS), {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create project: ${response.statusText}`);
    }

    return response.json();
  }

  // Update client profile
  async updateProfile(profileData: any): Promise<ApiResponse<ClientProfileResponse>> {
    const response = await fetch(getApiUrl('/client/profile'), {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update profile: ${response.statusText}`);
    }

    return response.json();
  }

  // Upload client profile image
  async uploadProfileImage(file: File): Promise<ApiResponse<{ profileImage: string }>> {
    const formData = new FormData();
    formData.append('profileImage', file);

    const response = await fetch(getApiUrl('/client/profile/image'), {
      method: 'PUT',
      headers: this.getAuthHeadersMultipart(),
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload profile image: ${response.statusText}`);
    }

    return response.json();
  }

  // Update client profile with image
  async updateProfileWithImage(formData: FormData): Promise<ApiResponse<ClientProfileResponse>> {
    const response = await fetch(getApiUrl('/client/profile'), {
      method: 'PUT',
      headers: this.getAuthHeadersMultipart(),
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to update profile with image: ${response.statusText}`);
    }

    return response.json();
  }

  async getDashboardData(): Promise<ClientDashboardResponse> {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CLIENT.DASHBOARD), {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
    }

    return response.json();
  }

  // Application Management
  async approveApplication(projectId: string, applicationId: string): Promise<ApiResponse<any>> {
    const response = await fetch(
      getApiUrl(`/client/projects/${projectId}/applications/${applicationId}/approve`),
      {
        method: 'PUT',
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to approve application: ${response.statusText}`);
    }

    return response.json();
  }

  async rejectApplication(projectId: string, applicationId: string): Promise<ApiResponse<any>> {
    const response = await fetch(
      getApiUrl(`/client/projects/${projectId}/applications/${applicationId}/reject`),
      {
        method: 'PUT',
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to reject application: ${response.statusText}`);
    }

    return response.json();
  }

  // Project Completion Management
  async approveCompletion(projectId: string): Promise<ApiResponse<any>> {
    const response = await fetch(
      getApiUrl(`/client/projects/${projectId}/approve-completion`),
      {
        method: 'PUT',
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to approve completion: ${response.statusText}`);
    }

    return response.json();
  }

  async rejectCompletion(projectId: string): Promise<ApiResponse<any>> {
    const response = await fetch(
      getApiUrl(`/client/projects/${projectId}/reject-completion`),
      {
        method: 'PUT',
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to reject completion: ${response.statusText}`);
    }

    return response.json();
  }

  // Freelancer Rating
  async rateFreelancer(projectId: string, rating: number, review: string): Promise<ApiResponse<any>> {
    const response = await fetch(
      getApiUrl(`/client/projects/${projectId}/rate-freelancer`),
      {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ rating, review }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to rate freelancer: ${response.statusText}`);
    }

    return response.json();
  }

  // Get Client Profile
  async getProfile(): Promise<ApiResponse<ClientProfileResponse>> {
    const response = await fetch(getApiUrl('/client/profile'), {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch client profile: ${response.statusText}`);
    }

    return response.json();
  }
}

export const clientService = new ClientService();

// Public API service (no authentication required)
export class PublicService {
  async getFreelancers(params?: {
    page?: number;
    limit?: number;
    skills?: string[];
    location?: string;
    minRating?: number;
    maxRate?: number;
    experienceLevel?: string;
    availability?: string;
    query?: string;
  }): Promise<ApiResponse<{
    freelancers: PublicFreelancer[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.skills && params.skills.length > 0) searchParams.append('skills', params.skills.join(','));
    if (params?.location) searchParams.append('location', params.location);
    if (params?.minRating) searchParams.append('minRating', params.minRating.toString());
    if (params?.maxRate) searchParams.append('maxRate', params.maxRate.toString());
    if (params?.experienceLevel) searchParams.append('experienceLevel', params.experienceLevel);
    if (params?.availability) searchParams.append('availability', params.availability);
    if (params?.query) searchParams.append('query', params.query);

    const url = getApiUrl(`/public/freelancers${searchParams.toString() ? `?${searchParams.toString()}` : ''}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch freelancers: ${response.statusText}`);
    }

    return response.json();
  }

  async getJobs(params?: {
    page?: number;
    limit?: number;
    skills?: string[];
    location?: string;
    budgetMin?: number;
    budgetMax?: number;
    duration?: string;
    query?: string;
  }): Promise<ApiResponse<{
    jobs: PublicJob[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.skills && params.skills.length > 0) searchParams.append('skills', params.skills.join(','));
    if (params?.location) searchParams.append('location', params.location);
    if (params?.budgetMin) searchParams.append('budgetMin', params.budgetMin.toString());
    if (params?.budgetMax) searchParams.append('budgetMax', params.budgetMax.toString());
    if (params?.duration) searchParams.append('duration', params.duration);
    if (params?.query) searchParams.append('query', params.query);

    const url = getApiUrl(`/public/jobs${searchParams.toString() ? `?${searchParams.toString()}` : ''}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch jobs: ${response.statusText}`);
    }

    return response.json();
  }

  // Public API Service for featured content
  async getFeaturedProjects(): Promise<FeaturedProjectsResponse> {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PUBLIC.FEATURED_PROJECTS), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch featured projects: ${response.statusText}`);
    }

    return response.json();
  }

  async getFeaturedFreelancers(): Promise<FeaturedFreelancersResponse> {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PUBLIC.FEATURED_FREELANCERS), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch featured freelancers: ${response.statusText}`);
    }

    return response.json();
  }

  // Get public freelancer profile by user ID
  async getFreelancerProfile(userId: string): Promise<ApiResponse<FreelancerProfileResponse>> {
    const response = await fetch(getApiUrl(`/public/freelancer/${userId}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch freelancer profile: ${response.statusText}`);
    }

    return response.json();
  }

  // Get public client profile by user ID
  async getClientProfile(userId: string): Promise<ApiResponse<ClientProfileResponse>> {
    const response = await fetch(getApiUrl(`/public/client/${userId}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch client profile: ${response.statusText}`);
    }

    return response.json();
  }
}

export const publicService = new PublicService();

// Freelancer API service
export class FreelancerService {
  private getAuthHeaders() {
    const token = getCurrentToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private getAuthHeadersMultipart() {
    const token = getCurrentToken();
    return {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  // Get Freelancer Profile
  async getProfile(): Promise<{ success: boolean; data: any; message: string }> {
    try {
      const response = await fetch(getApiUrl('/freelancer/profile'), {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch freelancer profile: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Ensure consistent response format
      if (data.success !== undefined) {
        return data;
      } else {
        return {
          success: true,
          data: data,
          message: 'Profile fetched successfully'
        };
      }
    } catch (error) {
      console.error('Error fetching freelancer profile:', error);
      throw error;
    }
  }

  // Create freelancer profile
  async createProfile(profileData: any): Promise<{ success: boolean; data: any; message: string }> {
    try {
      const response = await fetch(getApiUrl('/freelancer/profile'), {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create profile: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Ensure consistent response format
      if (data.success !== undefined) {
        return data;
      } else {
        return {
          success: true,
          data: data,
          message: 'Profile created successfully'
        };
      }
    } catch (error) {
      console.error('Error creating freelancer profile:', error);
      throw error;
    }
  }

  // Update freelancer profile
  async updateProfile(profileData: any): Promise<{ success: boolean; data: any; message: string }> {
    try {
      const response = await fetch(getApiUrl('/freelancer/profile'), {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update profile: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Ensure consistent response format
      if (data.success !== undefined) {
        return data;
      } else {
        return {
          success: true,
          data: data,
          message: 'Profile updated successfully'
        };
      }
    } catch (error) {
      console.error('Error updating freelancer profile:', error);
      throw error;
    }
  }

  // Upload freelancer profile image
  async uploadProfileImage(file: File): Promise<ApiResponse<{ profileImage: string }>> {
    const formData = new FormData();
    formData.append('profileImage', file);

    const response = await fetch(getApiUrl('/freelancer/profile/image'), {
      method: 'PUT',
      headers: this.getAuthHeadersMultipart(),
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload profile image: ${response.statusText}`);
    }

    return response.json();
  }

  // Update freelancer profile with image
  async updateProfileWithImage(formData: FormData): Promise<ApiResponse<FreelancerProfileResponse>> {
    const response = await fetch(getApiUrl('/freelancer/profile'), {
      method: 'PUT',
      headers: this.getAuthHeadersMultipart(),
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to update profile with image: ${response.statusText}`);
    }

    return response.json();
  }

  async applyToProject(projectId: string, applicationData: ProjectApplicationRequest): Promise<ProjectApplicationResponse> {
    const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.FREELANCER.APPLY_PROJECT}/${projectId}/apply`), {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(applicationData),
    });

    if (!response.ok) {
      throw new Error(`Failed to apply to project: ${response.statusText}`);
    }

    return response.json();
  }

  // Get Assigned Projects
  async getAssignedProjects(page: number = 1, limit: number = 10): Promise<{ success: boolean; data: any; message: string }> {
    try {
      const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.FREELANCER.ASSIGNED_PROJECTS}?status=ASSIGNED&page=${page}&limit=${limit}`), {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch assigned projects: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Ensure consistent response format
      if (data.success !== undefined) {
        return data;
      } else {
        return {
          success: true,
          data: { projects: data.projects || [] },
          message: 'Assigned projects fetched successfully'
        };
      }
    } catch (error) {
      console.error('Error fetching assigned projects:', error);
      throw error;
    }
  }

  // Get Freelancer Applications
  async getApplications(status?: string, page: number = 1, limit: number = 10): Promise<{ success: boolean; data: any; message: string }> {
    try {
      const statusParam = status ? `status=${status}&` : '';
      const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.FREELANCER.APPLICATIONS}?${statusParam}page=${page}&limit=${limit}`), {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch applications: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Ensure consistent response format
      if (data.success !== undefined) {
        return data;
      } else {
        return {
          success: true,
          data: { applications: data.applications || [] },
          message: 'Applications fetched successfully'
        };
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  }

  // Get Public Jobs
  async getPublicJobs(page: number = 1, limit: number = 12): Promise<{ success: boolean; data: any; message: string }> {
    try {
      const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.PUBLIC.JOBS}?page=${page}&limit=${limit}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch public jobs: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Ensure consistent response format
      if (data.success !== undefined) {
        return data;
      } else {
        return {
          success: true,
          data: { jobs: data.jobs || [] },
          message: 'Public jobs fetched successfully'
        };
      }
    } catch (error) {
      console.error('Error fetching public jobs:', error);
      throw error;
    }
  }

  // Request Project Completion
  async requestCompletion(projectId: string): Promise<ApiResponse<{ message: string }>> {
    const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.FREELANCER.REQUEST_COMPLETION}/${projectId}/request-completion`), {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to request completion: ${response.statusText}`);
    }

    return response.json();
  }
}

export const freelancerService = new FreelancerService();