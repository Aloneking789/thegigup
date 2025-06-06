import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Users, Briefcase, Star, Clock, MapPin, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const freelancers = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Full Stack Developer",
      skills: ["React", "Node.js", "Python"],
      rate: "₹1,200/hr",
      rating: 4.9,
      reviews: 127,
      location: "Mumbai, India",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      name: "Raj Patel",
      title: "UI/UX Designer",
      skills: ["Figma", "Adobe XD", "Sketch"],
      rate: "₹800/hr",
      rating: 4.8,
      reviews: 89,
      location: "Bangalore, India",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 3,
      name: "Priya Sharma",
      title: "Mobile App Developer",
      skills: ["Flutter", "React Native", "iOS"],
      rate: "₹1,000/hr",
      rating: 4.9,
      reviews: 156,
      location: "Delhi, India",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 4,
      name: "Amit Kumar",
      title: "Data Scientist",
      skills: ["Python", "Machine Learning", "SQL"],
      rate: "₹1,500/hr",
      rating: 4.7,
      reviews: 94,
      location: "Pune, India",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 5,
      name: "Neha Gupta",
      title: "Digital Marketer",
      skills: ["SEO", "Google Ads", "Social Media"],
      rate: "₹600/hr",
      rating: 4.8,
      reviews: 112,
      location: "Hyderabad, India",
      avatar: "/placeholder.svg?height=80&width=80",
    },
  ];

  const projects = [
    {
      id: 1,
      title: "E-commerce Website",
      description: "Complete online store with payment integration",
      price: "₹25,000",
      deliveryTime: "7-10 days",
      features: ["Responsive Design", "Payment Gateway", "Admin Panel", "SEO Optimized"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      title: "Mobile App Development",
      description: "Cross-platform mobile app for iOS and Android",
      price: "₹45,000",
      deliveryTime: "15-20 days",
      features: ["Cross Platform", "Push Notifications", "API Integration", "App Store Ready"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      title: "Business Website",
      description: "Professional website for your business",
      price: "₹15,000",
      deliveryTime: "5-7 days",
      features: ["Modern Design", "Mobile Friendly", "Contact Forms", "Google Analytics"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 4,
      title: "Portfolio Website",
      description: "Stunning portfolio to showcase your work",
      price: "₹8,000",
      deliveryTime: "3-5 days",
      features: ["Creative Design", "Gallery", "Blog Section", "Fast Loading"],
      image: "/placeholder.svg?height=200&width=300",
    },
  ];

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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {freelancers.map((freelancer) => (
              <Card key={freelancer.id} className="hover:shadow-lg transition-shadow duration-300 border-gray-200">
                <CardHeader className="text-center pb-4">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={freelancer.avatar || "/placeholder.svg"} alt={freelancer.name} />
                    <AvatarFallback>
                      {freelancer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg">{freelancer.name}</CardTitle>
                  <CardDescription className="text-blue-600 font-medium">{freelancer.title}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {freelancer.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 font-medium">{freelancer.rating}</span>
                      <span className="text-gray-500 ml-1">({freelancer.reviews})</span>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {freelancer.location}
                  </div>

                  <div className="text-center pt-2">
                    <div className="text-lg font-bold text-blue-600">{freelancer.rate}</div>
                    <Button size="sm" className="w-full mt-2 bg-blue-600 hover:bg-blue-700">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              View All Freelancers
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Ready-made Projects */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready-made Project Packages</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your project started quickly with our pre-designed packages. Perfect for businesses looking for fast,
              reliable solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-xl transition-all duration-300 border-gray-200 overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold text-blue-600">{project.price}</span>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <CardDescription className="text-gray-600">{project.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    Delivery: {project.deliveryTime}
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-900">What's included:</div>
                    {project.features.map((feature) => (
                      <div key={feature} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-4">Order Now</Button>
                </CardContent>
              </Card>
            ))}
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
