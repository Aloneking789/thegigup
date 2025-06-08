
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout, isLoggedIn } from "@/lib/config/api";

interface MobileNavProps {
  currentPath?: string;
  userLoggedIn?: boolean;
  userRole?: 'FREELANCER' | 'CLIENT' | null;
  userProfile?: any;
}

const MobileNav = ({ currentPath, userLoggedIn, userRole, userProfile }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const getNavItems = () => {
    if (!userLoggedIn) {
      // Guest navigation
      return [
        { path: "/find-talent", label: "Find Talent" },
        { path: "/find-work", label: "Find Work" },
        { path: "/about", label: "About" },
        { path: "/login", label: "Log In" },
        { path: "/signup", label: "Sign Up" },
      ];
    }

    // Authenticated user navigation
    const baseItems = [
      { path: "/about", label: "About" },
      { path: "/profile", label: "Profile" },
    ];

    if (userRole === 'CLIENT') {
      return [
        { path: "/find-talent", label: "Find Talent" },
        { path: "/client-dashboard", label: "Dashboard" },
        { path: "/post-job", label: "Post Job" },
        ...baseItems,
      ];
    } else if (userRole === 'FREELANCER') {
      return [
        { path: "/find-work", label: "Find Work" },
        { path: "/freelancer-dashboard", label: "Dashboard" },
        ...baseItems,
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2 pb-4 border-b">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FreelanceHub</span>
            </div>

            {/* User Profile Section (if logged in) */}
            {userLoggedIn && userProfile && (
              <div className="flex items-center space-x-3 pb-4 border-b">
                <Avatar className="w-10 h-10 border-2 border-blue-600">
                  <AvatarImage src={userProfile?.profileImage || undefined} />
                  <AvatarFallback className="bg-blue-600 text-white text-sm">
                    {userProfile?.name?.split(" ").map((n: string) => n[0]).join("") || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-gray-900">{userProfile?.name || 'User'}</div>
                  <div className="text-sm text-gray-600">{userRole}</div>
                </div>
              </div>
            )}
            
            <nav className="flex flex-col space-y-2">              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`p-3 rounded-lg transition-colors ${
                    currentPath === item.path
                      ? "bg-blue-100 text-blue-600 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Logout button for authenticated users */}
              {userLoggedIn && (
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="mt-4 border-red-300 text-red-600 hover:bg-red-50 w-full"
                >
                  Logout
                </Button>
              )}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
