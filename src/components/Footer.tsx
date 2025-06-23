import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { isLoggedIn, logout } from "@/lib/config/api";
import { clientService, freelancerService } from "@/lib/api/client";

interface FooterProps {
  className?: string;
}

const Footer = ({ className = "" }: FooterProps) => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userRole, setUserRole] = useState<'FREELANCER' | 'CLIENT' | null>(null);
  const navigate = useNavigate();

  // Check authentication status and fetch profile
  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      const loggedIn = isLoggedIn();
      setUserLoggedIn(loggedIn);
      
      if (loggedIn) {
        const role = localStorage.getItem('role') as 'FREELANCER' | 'CLIENT' | null;
        setUserRole(role);
        
        // Fetch user profile data
        try {
          let response;
          if (role === 'FREELANCER') {
            response = await freelancerService.getProfile();
          } else if (role === 'CLIENT') {
            response = await clientService.getProfile();
          }
          
          if (response?.success) {
            setUserProfile(response.data);
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      }
    };
    
    checkAuthAndFetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    setUserLoggedIn(false);
    setUserProfile(null);
    setUserRole(null);
    navigate('/');
  };

  return (
    <footer className={`bg-gray-900 text-white py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">TheGigUp</span>
            </div>
            <p className="text-gray-400">Connecting talented freelancers with amazing projects worldwide.</p>
            {userLoggedIn && (
              <div className="text-sm text-blue-400">
                Welcome back, {userProfile?.name?.split(' ')[0] || 'User'}!
              </div>
            )}
          </div>          {/* Dynamic Content Based on User Role */}
          {userLoggedIn && userRole === 'CLIENT' ? (
            // Client-specific sections
            <>
              <div>
                <h3 className="font-semibold mb-4">Client Dashboard</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link to="/client-dashboard" className="hover:text-white transition-colors">
                      My Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/find-talent" className="hover:text-white transition-colors">
                      Find Talent
                    </Link>
                  </li>
                  <li>
                    <Link to="/post-job" className="hover:text-white transition-colors">
                      Post a Job
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" className="hover:text-white transition-colors">
                      My Profile
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Resources</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link to="/about" className="hover:text-white transition-colors">
                      About TheGigUp
                    </Link>
                  </li>
                  {/* <li>
                    <Link to="/about" className="hover:text-white transition-colors">
                      How to Hire
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact-support" className="hover:text-white transition-colors">
                      Project Management
                    </Link>
                  </li> */}
                  <li>
                    <Link to="/contact-support" className="hover:text-white transition-colors">
                      Payment Protection
                    </Link>
                  </li>
                </ul>
              </div>
            </>
          ) : userLoggedIn && userRole === 'FREELANCER' ? (
            // Freelancer-specific sections
            <>
              <div>
                <h3 className="font-semibold mb-4">Freelancer Dashboard</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link to="/freelancer-dashboard" className="hover:text-white transition-colors">
                      My Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/find-work" className="hover:text-white transition-colors">
                      Find Work
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" className="hover:text-white transition-colors">
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/freelancer-dashboard" className="hover:text-white transition-colors">
                      My Proposals
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Resources</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link to="/about" className="hover:text-white transition-colors">
                      About TheGigUp
                    </Link>
                  </li>
                  <li>
                    <Link to="/how-to-find-work" className="hover:text-white transition-colors">
                      How to Find Work
                    </Link>
                  </li>
                  <li>
                    <Link to="/skill-development" className="hover:text-white transition-colors">
                      Skill Development
                    </Link>
                  </li>
                  <li>
                    <Link to="/success-stories" className="hover:text-white transition-colors">
                      Success Stories
                    </Link>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            // Guest user sections - show both client and freelancer options
            <>
              <div>
                <h3 className="font-semibold mb-4">For Clients</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link to="/signup?type=client" className="hover:text-white transition-colors">
                      Join as Client
                    </Link>
                  </li>
                  <li>
                    <Link to="/find-talent" className="hover:text-white transition-colors">
                      Browse Talent
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="hover:text-white transition-colors">
                      How to Hire
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact-support" className="hover:text-white transition-colors">
                      Enterprise Solutions
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">For Freelancers</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link to="/signup?type=freelancer" className="hover:text-white transition-colors">
                      Join as Freelancer
                    </Link>
                  </li>
                  <li>
                    <Link to="/find-work" className="hover:text-white transition-colors">
                      Browse Jobs
                    </Link>
                  </li>
                  <li>
                    <Link to="/get-started" className="hover:text-white transition-colors">
                      How to Get Started
                    </Link>
                  </li>
                  <li>
                    <Link to="/success-tips" className="hover:text-white transition-colors">
                      Success Tips
                    </Link>
                  </li>
                </ul>
              </div>
            </>
          )}

          {/* Company Section - Always visible */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/press" className="hover:text-white transition-colors">
                  Press & News
                </Link>
              </li>
              <li>
                <Link to="/contact-support" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              {/* <li>
                <Link to="/careers" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li> */}
              {userLoggedIn && (
                <li>
                  <button 
                    onClick={handleLogout}
                    className="hover:text-white transition-colors text-left"
                  >
                    Logout
                  </button>
                </li>
              )}
              {!userLoggedIn && (
                <li>
                  <Link to="/login" className="hover:text-white transition-colors">
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025   TheGigUp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
