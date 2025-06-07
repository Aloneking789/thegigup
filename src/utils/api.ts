
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000'; // You can set this in your environment

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role: 'CLIENT' | 'FREELANCER';
      profileImage?: string;
      bio?: string;
      location?: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
      client?: any;
      freelancer?: any;
    };
    token: string;
    client?: any;
    freelancer?: any;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ClientSignupData {
  name: string;
  email: string;
  password: string;
  companyName: string;
  industry: string;
  website: string;
  bio: string;
  location: string;
}

export interface FreelancerSignupData {
  name: string;
  email: string;
  password: string;
}

// Token management
export const tokenManager = {
  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },
  
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  removeToken: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
  },
  
  setUserRole: (role: string) => {
    localStorage.setItem('userRole', role);
  },
  
  getUserRole: () => {
    return localStorage.getItem('userRole');
  },
  
  setUserData: (userData: any) => {
    localStorage.setItem('userData', JSON.stringify(userData));
  },
  
  getUserData: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }
};

// API call helper with token
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = tokenManager.getToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Authentication API calls
export const authAPI = {
  clientLogin: async (data: LoginData): Promise<AuthResponse> => {
    return apiCall('/client/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  freelancerLogin: async (data: LoginData): Promise<AuthResponse> => {
    return apiCall('/freelancer/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  clientSignup: async (data: ClientSignupData): Promise<AuthResponse> => {
    return apiCall('/client/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  freelancerSignup: async (data: FreelancerSignupData): Promise<AuthResponse> => {
    // Use FormData for freelancer signup as specified
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);

    return fetch(`${BASE_URL}/freelancer/signup`, {
      method: 'POST',
      body: formData,
    }).then(res => res.json());
  },
};
