// API Configuration
export const API_CONFIG = {
  // BASE_URL: 'https://api.thegigup.com/api/v1',
  BASE_URL: 'https://gigup-five.vercel.app/api/v1',
  ENDPOINTS: {   
        EMAIL: {
      SEND_VERIFICATION_OTP: '/email/send-verification-otp',
      VERIFY_OTP: '/email/verify-otp'
    }, CLIENT: {
      LOGIN: '/client/login',
      SIGNUP: '/client/signup',
      FORGOT_PASSWORD: '/client/forgot-password',
      VERIFY_OTP: '/client/verify-otp',
      PROFILE: '/client/profile',
      PROJECTS: '/client/projects',
      DASHBOARD: '/client/dashboard',
      APPLICATIONS: '/client/applications',
    },FREELANCER: {
      SIGNUP: '/freelancer/signup',
      LOGIN: '/freelancer/login',
        FORGOT_PASSWORD: '/freelancer/forgot-password',
      VERIFY_OTP: '/freelancer/verify-otp',
      PROFILE: '/freelancer/profile',
      APPLY_PROJECT: '/freelancer/projects',
      ASSIGNED_PROJECTS: '/freelancer/projects',
      APPLICATIONS: '/freelancer/applications',
      REQUEST_COMPLETION: '/freelancer/projects',
    },
    COMMON: {
      PROJECTS: '/projects',
      APPLICATIONS: '/applications',
    },    PUBLIC: {
      JOBS: '/public/jobs',
      FEATURED_PROJECTS: '/public/featured/projects',
      FEATURED_FREELANCERS: '/public/featured/freelancers',
    }
  }
} as const;

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Token storage utilities
export const TokenStorage = {
  setClientToken: (token: string) => {
    localStorage.setItem('clienttoken', token);
  },
  
  setFreelancerToken: (token: string) => {
    localStorage.setItem('freelancertoken', token);
  },
  
  getClientToken: (): string | null => {
    return localStorage.getItem('clienttoken');
  },
  
  getFreelancerToken: (): string | null => {
    return localStorage.getItem('freelancertoken');
  },
  
  removeClientToken: () => {
    localStorage.removeItem('clienttoken');
  },
  
  removeFreelancerToken: () => {
    localStorage.removeItem('freelancertoken');
  },
  
  clearAllTokens: () => {
    localStorage.removeItem('clienttoken');
    localStorage.removeItem('freelancertoken');
  }
};

// Role storage utilities
export const RoleStorage = {
  setRole: (role: 'CLIENT' | 'FREELANCER') => {
    localStorage.setItem('role', role);
  },
  
  getRole: (): 'CLIENT' | 'FREELANCER' | null => {
    return localStorage.getItem('role') as 'CLIENT' | 'FREELANCER' | null;
  },
  
  removeRole: () => {
    localStorage.removeItem('role');
  },
  
  isClient: (): boolean => {
    return localStorage.getItem('role') === 'CLIENT';
  },
  
  isFreelancer: (): boolean => {
    return localStorage.getItem('role') === 'FREELANCER';
  }
};

// Get the appropriate token based on current role
export const getCurrentToken = (): string | null => {
  const role = RoleStorage.getRole();
  if (role === 'CLIENT') {
    return TokenStorage.getClientToken();
  } else if (role === 'FREELANCER') {
    return TokenStorage.getFreelancerToken();
  }
  return null;
};

// Set token based on role
export const setTokenByRole = (role: 'CLIENT' | 'FREELANCER', token: string) => {
  if (role === 'CLIENT') {
    TokenStorage.setClientToken(token);
  } else if (role === 'FREELANCER') {
    TokenStorage.setFreelancerToken(token);
  }
  RoleStorage.setRole(role);
};

// Check if user is logged in
export const isLoggedIn = (): boolean => {
  const token = getCurrentToken();
  return token !== null && token !== undefined;
};

// Logout utility - clears all tokens and role
export const logout = () => {
  TokenStorage.clearAllTokens();
  RoleStorage.removeRole();
};
