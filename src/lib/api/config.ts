// API Client Configuration for legacy services
import { API_CONFIG, getApiUrl, getCurrentToken } from '../config/api';

// Generic API Response interface
interface ApiResponse<T> {
  data: {
    success: boolean;
    data: T;
    message: string;
  };
}

// Create a fetch-based API client that mimics axios interface
const createApiClient = (isMultipart = false) => {
  const getHeaders = () => {
    const token = getCurrentToken();
    const headers: Record<string, string> = {};
    
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  };

  return {
    get: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
      const response = await fetch(getApiUrl(endpoint), {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    },

    post: async <T>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
      const headers = getHeaders();
      const config: RequestInit = {
        method: 'POST',
        headers,
      };

      if (data) {
        if (isMultipart && data instanceof FormData) {
          // Remove Content-Type header for FormData (browser will set it with boundary)
          delete headers['Content-Type'];
          config.body = data;
        } else {
          config.body = JSON.stringify(data);
        }
      }

      const response = await fetch(getApiUrl(endpoint), config);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    },

    put: async <T>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
      const headers = getHeaders();
      const config: RequestInit = {
        method: 'PUT',
        headers,
      };

      if (data) {
        if (isMultipart && data instanceof FormData) {
          // Remove Content-Type header for FormData (browser will set it with boundary)
          delete headers['Content-Type'];
          config.body = data;
        } else {
          config.body = JSON.stringify(data);
        }
      }

      const response = await fetch(getApiUrl(endpoint), config);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    },

    delete: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
      const response = await fetch(getApiUrl(endpoint), {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    },
  };
};

// Export the API clients
export const apiClient = createApiClient(false);
export const apiClientMultipart = createApiClient(true);