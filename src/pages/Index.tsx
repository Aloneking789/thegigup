import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Users, Briefcase, Star, Clock, MapPin, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { publicService } from "@/lib/api/client";
import { FeaturedProject, FeaturedFreelancer } from "@/lib/api/types";
import { isLoggedIn, RoleStorage } from "@/lib/config/api";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredFreelancers, setFeaturedFreelancers] = useState<FeaturedFreelancer[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<FeaturedProject[]>([]);
  const [isLoadingFreelancers, setIsLoadingFreelancers] = useState(true);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    setUserLoggedIn(isLoggedIn());
  }, []);

  // Get appropriate dashboard route based on user role
  const getDashboardRoute = (): string => {
    if (RoleStorage.isClient()) {
      return "/client-dashboard";
    } else if (RoleStorage.isFreelancer()) {
      return "/freelancer-dashboard";
    }
    return "/login"; // fallback if no role found
  };

  // Fetch featured freelancers
  useEffect(() => {
    const fetchFeaturedFreelancers = async () => {
      try {
        setIsLoadingFreelancers(true);
        const response = await publicService.getFeaturedFreelancers();
        if (response.success) {
          setFeaturedFreelancers(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch featured freelancers:', error);
        setFeaturedFreelancers([]);
      } finally {
        setIsLoadingFreelancers(false);
      }
    };

    fetchFeaturedFreelancers();
  }, []);

  // Fetch featured projects
  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        setIsLoadingProjects(true);
        const response = await publicService.getFeaturedProjects();
        if (response.success) {
          setFeaturedProjects(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch featured projects:', error);
        setFeaturedProjects([]);
      } finally {
        setIsLoadingProjects(false);
      }
    };    fetchFeaturedProjects();
  }, []);

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
              <span className="text-xl font-bold text-gray-900">FreelanceHub</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/find-talent" className="text-gray-600 hover:text-blue-600 transition-colors">
                Find Talent
              </Link>
              <Link to="/find-work" className="text-gray-600 hover:text-blue-600 transition-colors">
                Find Work
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                About
              </Link>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                Log In
              </Link>
              <Link to="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700">Sign Up</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Find the perfect
                  <span className="text-blue-600"> freelancer</span> for your project
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Connect with skilled professionals and get your work done efficiently. From web development to design,
                  find experts for every project.
                </p>
              </div>

              {/* Search Bar */}
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search for skills (e.g., React, Python, Design...)"
                    className="pl-10 h-12 text-lg border-gray-200 focus:border-blue-500"
                  />
                </div>

                {/* User Type Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link to="/signup?type=client">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-14 text-lg font-semibold w-full">
                      <Users className="w-5 h-5 mr-2" />
                      I'm a Client
                    </Button>
                  </Link>
                  <Link to="/signup?type=freelancer">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50 h-14 text-lg font-semibold w-full"
                    >
                      <Briefcase className="w-5 h-5 mr-2" />
                      I'm a Freelancer
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">10K+</div>
                  <div className="text-gray-600">Active Freelancers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">5K+</div>
                  <div className="text-gray-600">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">98%</div>
                  <div className="text-gray-600">Client Satisfaction</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img
                  src="/placeholder.svg?height=600&width=500"
                  alt="Freelancer working"
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-200 rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-48 h-48 bg-purple-200 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Freelancers */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Top Freelancers Ready to Work</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse through our curated list of skilled professionals and find the perfect match for your project
            </p>
          </div>          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {isLoadingFreelancers ? (
              // Loading state
              Array.from({ length: 5 }).map((_, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-gray-200">
                  <CardHeader className="text-center pb-4">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3 mx-auto"></div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                      ))}
                    </div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  </CardContent>
                </Card>
              ))
            ) : featuredFreelancers.length === 0 ? (
              // Empty state
              <div className="col-span-full text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Featured Freelancers</h3>
                <p className="text-gray-600">Featured freelancers will appear here soon.</p>
              </div>
            ) : (
              // Display freelancers
              featuredFreelancers.map((freelancer) => (
                <Card key={freelancer.id} className="hover:shadow-lg transition-shadow duration-300 border-gray-200">
                  <CardHeader className="text-center pb-4">
                    <Avatar className="w-20 h-20 mx-auto mb-4">
                      <AvatarImage src={freelancer.profile.profileImage || "/placeholder.svg"} alt={freelancer.profile.name} />
                      <AvatarFallback>
                        {freelancer.profile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">{freelancer.profile.name}</CardTitle>
                    <CardDescription className="text-blue-600 font-medium">{freelancer.profile.bio}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {freelancer.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {freelancer.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{freelancer.skills.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 font-medium">{freelancer.ratings || 0}</span>
                        <span className="text-gray-500 ml-1">({freelancer.projectsCompleted} projects)</span>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {freelancer.profile.location || "Remote"}
                    </div>

                    <div className="text-center pt-2">
                      <div className="text-lg font-bold text-blue-600">₹{freelancer.hourlyRate}/hr</div>
                      <Button size="sm" className="w-full mt-2 bg-blue-600 hover:bg-blue-700">
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              View All Freelancers
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>      {/* Featured Projects */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Projects</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing project opportunities from verified clients. Start your freelancing journey today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingProjects ? (
              // Loading state
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 border-gray-200 overflow-hidden">
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                      ))}
                    </div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </Card>
              ))
            ) : featuredProjects.length === 0 ? (
              // Empty state
              <div className="col-span-full text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Featured Projects</h3>
                <p className="text-gray-600">Featured projects will appear here soon.</p>
              </div>
            ) : (
              // Display featured projects
              featuredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="hover:shadow-xl transition-all duration-300 border-gray-200 overflow-hidden"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <Badge variant="outline" className="text-blue-600 border-blue-200">
                        ₹{project.budget.min} - ₹{project.budget.max}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-600 line-clamp-3">{project.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {project.skillsRequired.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {project.skillsRequired.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.skillsRequired.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        Duration: {project.duration}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        {project.applicationsCount} applications
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="w-4 h-4 mr-2 text-yellow-400 fill-current" />
                        Client rating: {project.client.ratings}/5
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={project.client.profileImage || "/placeholder.svg"} />
                          <AvatarFallback>
                            {project.client.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{project.client.name}</p>
                          <p className="text-xs text-gray-600">{project.client.company} • {project.client.location}</p>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-4">
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to get started?</h2>
            <p className="text-xl text-blue-100">
              Join thousands of clients and freelancers who trust FreelanceHub for their projects
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 h-14 px-8 text-lg font-semibold"
                onClick={() => navigate("/client-signup")}
              >
                Post a Project
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 h-14 px-8 text-lg font-semibold"
                onClick={() => navigate("/freelancer-signup")}
              >
                Find Work
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">FreelanceHub</span>
              </div>
              <p className="text-gray-400">Connecting talented freelancers with amazing projects worldwide.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Clients</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    How to Hire
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Talent Marketplace
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Project Catalog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Enterprise
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Freelancers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    How to Find Work
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Direct Contracts
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Find Freelance Jobs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Resources
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Leadership
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FreelanceHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
