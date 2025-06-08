import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const clientToken = localStorage.getItem('clienttoken');
  const freelancerToken = localStorage.getItem('freelancertoken');
  const token = clientToken || freelancerToken;
  const userRole = localStorage.getItem('role');
  
  // Check if user is authenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has the required role (if specified)
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on user role
    if (userRole === 'CLIENT') {
      return <Navigate to="/client-dashboard" replace />;
    } else if (userRole === 'FREELANCER') {
      return <Navigate to="/freelancer-dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;