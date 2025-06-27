import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Sitemap = () => {
  const sitePages = [
    {
      category: "Main Pages",
      description: "Core platform functionality",
      pages: [
        { name: "Homepage", path: "/", description: "Main landing page" },
        { name: "About Us", path: "/about", description: "Learn about TheGigUp" },
        { name: "Get Started", path: "/get-started", description: "Start your journey" },
      ]
    },
    {
      category: "Authentication",
      description: "User account management",
      pages: [
        { name: "Login", path: "/login", description: "Sign in to your account" },
        { name: "Sign Up", path: "/signup", description: "Create a new account" },
        { name: "Client Signup", path: "/client-signup", description: "Join as a client" },
        { name: "Freelancer Signup", path: "/freelancer-signup", description: "Join as a freelancer" },
        { name: "Forgot Password", path: "/forgot-password", description: "Reset your password" },
      ]
    },
    {
      category: "Platform Features",
      description: "Main platform functionality",
      pages: [
        { name: "Find Talent", path: "/find-talent", description: "Discover skilled freelancers", badge: "Clients" },
        { name: "Find Work", path: "/find-work", description: "Browse available projects", badge: "Freelancers" },
        { name: "Post a Job", path: "/post-job", description: "Create job postings", badge: "Clients" },
      ]
    },
    {
      category: "Dashboard & Profiles",
      description: "User management and profiles",
      pages: [
        { name: "Dashboard", path: "/dashboard", description: "Main dashboard", badge: "Protected" },
        { name: "Client Dashboard", path: "/client-dashboard", description: "Client-specific dashboard", badge: "Clients" },
        { name: "Freelancer Dashboard", path: "/freelancer-dashboard", description: "Freelancer-specific dashboard", badge: "Freelancers" },
        { name: "Profile", path: "/profile", description: "View your profile", badge: "Protected" },
        { name: "Edit Profile", path: "/edit-profile", description: "Update your profile", badge: "Protected" },
        { name: "Client Profile Setup", path: "/client-profile-setup", description: "Complete client profile", badge: "Clients" },
        { name: "Freelancer Profile Setup", path: "/freelancer-profile-setup", description: "Complete freelancer profile", badge: "Freelancers" },
      ]
    },
    {
      category: "Learning & Resources",
      description: "Educational content and tips",
      pages: [
        { name: "How to Find Work", path: "/how-to-find-work", description: "Guide to finding freelance work" },
        { name: "Success Tips", path: "/success-tips", description: "Tips for freelance success" },
        { name: "Skill Development", path: "/skill-development", description: "Improve your skills" },
        { name: "Success Stories", path: "/success-stories", description: "Read inspiring stories" },
      ]
    },
    {
      category: "Support & Information",
      description: "Help and company information",
      pages: [
        { name: "Contact Support", path: "/contact-support", description: "Get help and support" },
        { name: "Press & News", path: "/press", description: "Latest news and press releases" },
      ]
    },
    {
      category: "Legal",
      description: "Terms and privacy information",
      pages: [
        { name: "Terms of Service", path: "/terms", description: "Our terms and conditions" },
        { name: "Privacy Policy", path: "/privacy", description: "How we protect your privacy" },
      ]
    }
  ];

  const getBadgeVariant = (badge: string | undefined) => {
    switch (badge) {
      case "Clients": return "default";
      case "Freelancers": return "secondary";
      case "Protected": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Site Map
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore all pages and features available on TheGigUp platform
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to Homepage
            </Link>
          </div>
        </div>

        {/* Site Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {sitePages.reduce((total, category) => total + category.pages.length, 0)}
              </div>
              <div className="text-gray-600">Total Pages</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {sitePages.length}
              </div>
              <div className="text-gray-600">Categories</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                24/7
              </div>
              <div className="text-gray-600">Available</div>
            </CardContent>
          </Card>
        </div>

        {/* Page Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {sitePages.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="h-fit">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {category.category}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.pages.map((page, pageIndex) => (
                    <div key={pageIndex} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Link
                            to={page.path}
                            className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {page.name}
                          </Link>
                          {page.badge && (
                            <Badge variant={getBadgeVariant(page.badge)} className="text-xs">
                              {page.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {page.description}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">
                        {page.path}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Need Help Navigating?
            </h3>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact-support"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Contact Support
              </Link>
              <Link
                to="/get-started"
                className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Get Started Guide
              </Link>
            </div>
          </div>
        </div>

        {/* SEO Information */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Last updated: June 25, 2025 |
            <a
              href="https://www.thegigup.com/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 ml-1"
            >
              XML Sitemap
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
