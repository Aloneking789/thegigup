
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { logout } from "@/lib/config/api";

interface MobileNavProps {
  currentPath?: string;
}

const MobileNav = ({ currentPath }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const navItems = [
    { path: "/find-talent", label: "Find Talent" },
    { path: "/find-work", label: "Find Work" },
    { path: "/about", label: "About" },
    { path: "/profile", label: "Profile" },
    { path: "/post-job", label: "Post Job" },
  ];

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2 pb-4 border-b">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FreelanceHub</span>
            </div>
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
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="mt-4 border-red-300 text-red-600 hover:bg-red-50 w-full"
              >
                Logout
              </Button>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
