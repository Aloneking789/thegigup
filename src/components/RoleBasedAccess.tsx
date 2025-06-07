import { Navigate } from 'react-router-dom';
import { isLoggedIn, RoleStorage } from '@/lib/config/api';

interface RoleBasedAccessProps {
  children: React.ReactNode;
  allowedRoles: ('CLIENT' | 'FREELANCER')[];
  fallbackPath?: string;
}

/**
 * RoleBasedAccess component for pages that can be accessed by multiple roles
 * but need different behavior based on the user's role
 */
const RoleBasedAccess = ({ 
  children, 
  allowedRoles, 
  fallbackPath = '/login' 
}: RoleBasedAccessProps) => {
  const isAuthenticated = isLoggedIn();
  const userRole = RoleStorage.getRole();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is allowed
  if (!userRole || !allowedRoles.includes(userRole)) {
    // Redirect to their appropriate dashboard or fallback
    if (userRole === 'CLIENT') {
      return <Navigate to="/client-dashboard" replace />;
    } else if (userRole === 'FREELANCER') {
      return <Navigate to="/freelancer-dashboard" replace />;
    }
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default RoleBasedAccess;
