import { Navigate } from 'react-router-dom';
import { isLoggedIn, RoleStorage } from '@/lib/config/api';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectAuthenticated?: boolean;
}

/**
 * PublicRoute component for pages that should only be accessible to non-authenticated users
 * (like login, signup pages)
 */
const PublicRoute = ({ 
  children, 
  redirectAuthenticated = true 
}: PublicRouteProps) => {
  const isAuthenticated = isLoggedIn();
  const userRole = RoleStorage.getRole();

  // If user is authenticated and we should redirect them
  if (redirectAuthenticated && isAuthenticated) {
    // Redirect to appropriate dashboard based on role
    if (userRole === 'CLIENT') {
      return <Navigate to="/client-dashboard" replace />;
    } else if (userRole === 'FREELANCER') {
      return <Navigate to="/freelancer-dashboard" replace />;
    }
    // Fallback to home if role is unclear
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
