import { Navigate, useLocation } from 'react-router-dom';
import { isLoggedIn, RoleStorage } from '@/lib/config/api';
import SecurityWrapper from './SecurityWrapper';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: 'CLIENT' | 'FREELANCER';
  redirectTo?: string;
  enableSecurity?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  requiredRole, 
  redirectTo = '/login',
  enableSecurity = true
}: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthenticated = isLoggedIn();
  const userRole = RoleStorage.getRole();

  // If authentication is required but user is not logged in
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If a specific role is required but user doesn't have that role
  if (requiredRole && userRole !== requiredRole) {
    // Redirect based on their actual role
    if (userRole === 'CLIENT') {
      return <Navigate to="/client-dashboard" replace />;
    } else if (userRole === 'FREELANCER') {
      return <Navigate to="/freelancer-dashboard" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  // If user is authenticated but tries to access auth pages (login/signup)
  if (!requireAuth && isAuthenticated) {
    // Redirect to appropriate dashboard based on role
    if (userRole === 'CLIENT') {
      return <Navigate to="/client-dashboard" replace />;
    } else if (userRole === 'FREELANCER') {
      return <Navigate to="/freelancer-dashboard" replace />;
    }
  }

  // Wrap with security if enabled and user is authenticated
  if (enableSecurity && requireAuth && isAuthenticated) {
    return (
      <SecurityWrapper>
        {children}
      </SecurityWrapper>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
