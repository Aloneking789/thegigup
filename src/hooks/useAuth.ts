import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isLoggedIn, RoleStorage, getCurrentToken } from '@/lib/config/api';

export interface AuthState {
  isAuthenticated: boolean;
  userRole: 'CLIENT' | 'FREELANCER' | null;
  token: string | null;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userRole: null,
    token: null,
    isLoading: true,
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isLoggedIn();
      const role = RoleStorage.getRole();
      const token = getCurrentToken();

      setAuthState({
        isAuthenticated: authenticated,
        userRole: role,
        token,
        isLoading: false,
      });
    };

    checkAuth();

    // Listen for storage changes (e.g., logout in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'clienttoken' || e.key === 'freelancertoken' || e.key === 'role') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const redirectToAppropiateDashboard = () => {
    if (authState.userRole === 'CLIENT') {
      navigate('/client-dashboard');
    } else if (authState.userRole === 'FREELANCER') {
      navigate('/freelancer-dashboard');
    } else {
      navigate('/login');
    }
  };

  const redirectToLogin = () => {
    navigate('/login', { state: { from: location } });
  };

  const hasRole = (role: 'CLIENT' | 'FREELANCER') => {
    return authState.userRole === role;
  };

  const hasAnyRole = (roles: ('CLIENT' | 'FREELANCER')[]) => {
    return authState.userRole ? roles.includes(authState.userRole) : false;
  };

  return {
    ...authState,
    redirectToAppropiateDashboard,
    redirectToLogin,
    hasRole,
    hasAnyRole,
  };
};

export default useAuth;
