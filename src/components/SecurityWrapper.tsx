import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn, getCurrentToken, logout } from '@/lib/config/api';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SecurityWrapperProps {
  children: React.ReactNode;
  checkTokenValidity?: boolean;
  maxInactivityTime?: number; // in minutes
}

const SecurityWrapper = ({ 
  children, 
  checkTokenValidity = true,
  maxInactivityTime = 120 // 2 hours default
}: SecurityWrapperProps) => {
  const [isValidating, setIsValidating] = useState(checkTokenValidity);
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!checkTokenValidity) {
      setIsValidating(false);
      return;
    }

    const validateToken = async () => {
      try {
        const token = getCurrentToken();
        
        if (!token) {
          setIsValid(false);
          setError('No authentication token found');
          return;
        }

        // Check if token is expired (basic JWT expiry check)
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Date.now() / 1000;
          
          if (payload.exp && payload.exp < currentTime) {
            logout();
            setIsValid(false);
            setError('Session expired');
            return;
          }
        } catch (e) {
          // If token is not a valid JWT, that's okay for some implementations
          console.warn('Token is not a valid JWT format');
        }

        // Check for inactivity
        const lastActivity = localStorage.getItem('lastActivity');
        if (lastActivity && maxInactivityTime > 0) {
          const lastActivityTime = parseInt(lastActivity);
          const inactiveTime = (Date.now() - lastActivityTime) / (1000 * 60); // in minutes
          
          if (inactiveTime > maxInactivityTime) {
            logout();
            setIsValid(false);
            setError('Session expired due to inactivity');
            return;
          }
        }

        // Update last activity
        localStorage.setItem('lastActivity', Date.now().toString());
        
        setIsValid(true);
        setError(null);
      } catch (error) {
        console.error('Token validation error:', error);
        setIsValid(false);
        setError('Authentication validation failed');
      } finally {
        setIsValidating(false);
      }
    };

    if (isLoggedIn()) {
      validateToken();
    } else {
      setIsValidating(false);
      setIsValid(false);
      setError('User not authenticated');
    }

    // Set up activity listeners
    const updateActivity = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [checkTokenValidity, maxInactivityTime]);

  // Loading state
  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Validating session...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Invalid token or error state
  if (!isValid || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Session Invalid</h2>
            <p className="text-gray-600 mb-6">
              {error || 'Your session is no longer valid. Please log in again.'}
            </p>
            <Button 
              onClick={() => {
                logout();
                window.location.href = '/login';
              }}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Login Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default SecurityWrapper;
