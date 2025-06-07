import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft, Search } from "lucide-react";
import { isLoggedIn, RoleStorage } from "@/lib/config/api";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = isLoggedIn();
  const userRole = RoleStorage.getRole();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoDashboard = () => {
    if (userRole === 'CLIENT') {
      navigate('/client-dashboard');
    } else if (userRole === 'FREELANCER') {
      navigate('/freelancer-dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="text-center shadow-xl border-0">
          <CardHeader className="pb-4">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-red-500" />
            </div>
            <CardTitle className="text-6xl font-bold text-gray-900 mb-2">404</CardTitle>
            <p className="text-xl text-gray-600">Oops! Page not found</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-500 mb-6">
              The page you're looking for doesn't exist or you don't have permission to access it.
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={handleGoHome} 
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Home
              </Button>
              
              {isAuthenticated && (
                <Button 
                  onClick={handleGoDashboard} 
                  variant="outline" 
                  className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                  size="lg"
                >
                  Go to Dashboard
                </Button>
              )}
              
              <Button 
                onClick={handleGoBack} 
                variant="ghost" 
                className="w-full text-gray-600 hover:text-gray-800"
                size="lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-400">
                Error Code: 404 | Path: {location.pathname}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
