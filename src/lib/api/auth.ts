import { apiClient } from './config';
import { 
  LoginRequest, 
  SignupRequest, 
  AuthResponse, 
  User,
  ApiResponse 
} from './types';

// Authentication Service
export const authService = {
  // Login user
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/login', credentials);
    
    if (response.data.success) {
      const { user, token } = response.data.data;
      
      // Store auth data in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(user));
      
      return response.data.data;
    }
    
    throw new Error(response.data.message);
  },
  // Register user
  signup: async (userData: SignupRequest): Promise<AuthResponse> => {
    const endpoint = userData.userType === 'freelancer' ? '/freelancer/signup' : '/client/signup';
    const response = await apiClient.post<ApiResponse<AuthResponse>>(endpoint, userData);

    if (response.data.success) {
      const { user, token } = response.data.data;
      
      // Store auth data in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(user));
      
      return response.data.data;
    }
    
    throw new Error(response.data.message);
  },

  // Login user (unified endpoint for both user types)
  loginUnified: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/login', credentials);
    
    if (response.data.success) {
      const { user, token } = response.data.data;
      
      // Store auth data in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(user));
      
      return response.data.data;
    }
    
    throw new Error(response.data.message);
  },
  // Separate login endpoints
  freelancerLogin: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/freelancer/login', credentials);
    
    if (response.data.success) {
      const { user, token } = response.data.data;
      
      // Store auth data in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(user));
      
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Freelancer login failed');
  },

  clientLogin: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/client/login', credentials);
    
    if (response.data.success) {
      const { user, token } = response.data.data;
      
      // Store auth data in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(user));
      
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Client login failed');
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Always clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message);
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('authToken');
    return !!token;
  },

  // Get stored user data
  getStoredUser: (): User | null => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  // Get stored auth token
  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  },

  // Refresh token
  refreshToken: async (): Promise<string> => {
    const response = await apiClient.post<ApiResponse<{ token: string }>>('/auth/refresh');
    
    if (response.data.success) {
      const { token } = response.data.data;
      localStorage.setItem('authToken', token);
      return token;
    }
    
    throw new Error(response.data.message);
  },

  // Verify email
  verifyEmail: async (token: string): Promise<void> => {
    const response = await apiClient.post<ApiResponse<void>>('/auth/verify-email', { token });
    
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  },

  // Request password reset
  requestPasswordReset: async (email: string): Promise<void> => {
    const response = await apiClient.post<ApiResponse<void>>('/auth/forgot-password', { email });
    
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  },

  // Reset password
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    const response = await apiClient.post<ApiResponse<void>>('/auth/reset-password', {
      token,
      password: newPassword,
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  },
};
