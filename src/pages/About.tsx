
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Briefcase,
  Settings,
  Users,
  Globe,
  Shield,
  Clock,
  CheckCircle
} from "lucide-react";
import { logout, isLoggedIn } from "@/lib/config/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import MobileNav from "@/components/MobileNav";

const About = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'FREELANCER' | 'CLIENT' | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const loggedIn = isLoggedIn();
    setUserLoggedIn(loggedIn);
    
    if (loggedIn) {
      const role = localStorage.getItem('role') as 'FREELANCER' | 'CLIENT' | null;
      setUserRole(role);
      // You can fetch user profile here if needed
    }
  }, []);
  const handleLogout = () => {
    logout();
    setUserLoggedIn(false);
    setUserProfile(null);
    setUserRole(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <Link to="/" className="text-xl font-bold text-gray-900">TheGigUp</Link>
            </div>            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/find-talent" className="text-gray-600 hover:text-blue-600">Find Talent</Link>
              <Link to="/find-work" className="text-gray-600 hover:text-blue-600">Find Work</Link>
              <Link to="/about" className="text-blue-600 font-medium">About</Link>
              {userLoggedIn && <Link to="/profile" className="text-gray-600 hover:text-blue-600">Profile</Link>}
              {userLoggedIn ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-blue-600">Log In</Link>
                  <Link to="/signup">
                    <Button className="bg-blue-600 hover:bg-blue-700">Sign Up</Button>
                  </Link>
                </>
              )}
            </nav>
            <MobileNav 
              currentPath={location.pathname}
              userLoggedIn={userLoggedIn}
              userRole={userRole}
              userProfile={userProfile}
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About TheGigUp
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're building the world's work marketplace — a place where businesses and independent professionals can find each other and collaborate remotely.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              To create economic opportunities for people around the world by connecting businesses with independent talent. We believe that talent is equally distributed, but opportunity is not.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              TheGigUp helps level the playing field by giving everyone access to the global economy, regardless of where they live.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Values</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Trust & Safety</h4>
                  <p className="text-gray-600 text-sm">Protecting our community through verified profiles and secure payments</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Global Opportunity</h4>
                  <p className="text-gray-600 text-sm">Connecting talent worldwide with businesses of all sizes</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Innovation</h4>
                  <p className="text-gray-600 text-sm">Continuously improving our platform to serve our users better</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">50K+</div>
            <div className="text-gray-600">Active Freelancers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">25K+</div>
            <div className="text-gray-600">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">100K+</div>
            <div className="text-gray-600">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">190+</div>
            <div className="text-gray-600">Countries</div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white border-gray-200">
            <CardHeader className="text-center">
              <Globe className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Global Reach</CardTitle>
              <CardDescription>
                Connect with talent and opportunities from around the world
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader className="text-center">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Secure Platform</CardTitle>
              <CardDescription>
                Protected payments and verified profiles ensure safe transactions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader className="text-center">
              <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>24/7 Support</CardTitle>
              <CardDescription>
                Round-the-clock customer support to help you succeed
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join millions of freelancers and clients who trust TheGigUp for their projects
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Users className="w-5 h-5 mr-2" />
              Find Talent
            </Button>
            <Button size="lg" variant="outline" className="border-white text-blue-600 hover:bg-white hover:text-blue-600">
              <Briefcase className="w-5 h-5 mr-2" />
              Find Work
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
