import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const token = localStorage.getItem('token') || localStorage.getItem('clienttoken');
  const userRole = localStorage.getItem('role');
  
  // If user is already authenticated, redirect to appropriate dashboard
  if (token && userRole) {
    if (userRole === 'CLIENT') {
      return <Navigate to="/client-dashboard" replace />;
    } else if (userRole === 'FREELANCER') {
      return <Navigate to="/freelancer-dashboard" replace />;
    }
  }
  
  return <>{children}</>;
};

export default PublicRoute;