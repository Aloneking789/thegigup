
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Star, MapPin, Clock, Users, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const topFreelancers = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Full Stack Developer",
      rating: 4.9,
      hourlyRate: 1200,
      skills: ["React", "Node.js", "Python"],
      location: "Mumbai, India",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Arjun Patel",
      role: "UI/UX Designer",
      rating: 4.8,
      hourlyRate: 800,
      skills: ["Figma", "Adobe XD", "Sketch"],
      location: "Bangalore, India",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Sneha Reddy",
      role: "Digital Marketer",
      rating: 4.9,
      hourlyRate: 600,
      skills: ["SEO", "Google Ads", "Social Media"],
      location: "Hyderabad, India",
      image: "/placeholder.svg"
    }
  ];

  const readymadeProjects = [
    {
      title: "Basic Portfolio Website",
      price: 5000,
      description: "Responsive portfolio with modern design",
      category: "Web Development"
    },
    {
      title: "E-commerce Mobile App",
      price: 15000,
      description: "Full-featured shopping app with payment integration",
      category: "Mobile Development"
    },
    {
      title: "Logo & Brand Identity",
      price: 3000,
      description: "Complete branding package with logo and guidelines",
      category: "Design"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FreelanceHub
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/signup")} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Connect. Create. Collaborate.
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            The ultimate platform connecting talented freelancers with visionary clients
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-12">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search freelancers by skill (e.g., React, UI/UX, Python)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg rounded-full border-2 border-gray-200 focus:border-blue-500 shadow-lg"
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-4 text-lg rounded-full shadow-xl transform hover:scale-105 transition-all"
              onClick={() => navigate("/client-signup")}
            >
              <Users className="w-5 h-5 mr-2" />
              Hire Talent
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-4 text-lg rounded-full shadow-xl transform hover:scale-105 transition-all"
              onClick={() => navigate("/freelancer-signup")}
            >
              <Briefcase className="w-5 h-5 mr-2" />
              Find Work
            </Button>
          </div>
        </div>
      </section>

      {/* Top Freelancers */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Top Freelancers
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {topFreelancers.map((freelancer) => (
              <Card key={freelancer.id} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={freelancer.image}
                      alt={freelancer.name}
                      className="w-16 h-16 rounded-full object-cover mr-4 border-4 border-blue-100"
                    />
                    <div>
                      <h4 className="font-semibold text-lg text-gray-800">{freelancer.name}</h4>
                      <p className="text-gray-600">{freelancer.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 font-semibold">{freelancer.rating}</span>
                    <MapPin className="w-4 h-4 text-gray-400 ml-4" />
                    <span className="ml-1 text-gray-600 text-sm">{freelancer.location}</span>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-green-600">₹{freelancer.hourlyRate}/hr</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {freelancer.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="bg-blue-100 text-blue-700">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Readymade Projects */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Readymade Projects
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {readymadeProjects.map((project, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
                <CardContent className="p-6">
                  <Badge className="mb-3 bg-purple-100 text-purple-700">{project.category}</Badge>
                  <h4 className="font-semibold text-xl mb-3 text-gray-800">{project.title}</h4>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-green-600">₹{project.price.toLocaleString()}</p>
                    <Button size="sm" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                      Order Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Briefcase className="w-6 h-6" />
                <h3 className="text-xl font-bold">FreelanceHub</h3>
              </div>
              <p className="text-gray-400">
                Connecting talent with opportunity worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Clients</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Post Jobs</li>
                <li>Find Freelancers</li>
                <li>Project Management</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Freelancers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Find Work</li>
                <li>Build Profile</li>
                <li>Plus Membership</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
