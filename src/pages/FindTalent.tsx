import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Eye, 
  MessageSquare,
  Briefcase,
  Settings,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MobileNav from "@/components/MobileNav";
import FreelancerContactModal from "@/components/FreelancerContactModal";

const mockFreelancers = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Full Stack Developer",
    skills: ["React", "Node.js", "Python", "MongoDB"],
    rate: "₹1,200/hr",
    rating: 4.9,
    reviews: 127,
    location: "Mumbai, India",
    avatar: "/placeholder.svg",
    bio: "Experienced full-stack developer with 5+ years in building scalable web applications.",
    completedProjects: 45,
    experience: "5+ years"
  },
  {
    id: 2,
    name: "Raj Patel",
    title: "UI/UX Designer",
    skills: ["Figma", "Adobe XD", "Sketch", "Prototyping"],
    rate: "₹800/hr",
    rating: 4.8,
    reviews: 89,
    location: "Bangalore, India",
    avatar: "/placeholder.svg",
    bio: "Creative designer specializing in user-centered design and modern interfaces.",
    completedProjects: 32,
    experience: "3+ years"
  },
  {
    id: 3,
    name: "Priya Sharma",
    title: "Mobile App Developer",
    skills: ["Flutter", "React Native", "iOS", "Android"],
    rate: "₹1,000/hr",
    rating: 4.9,
    reviews: 156,
    location: "Delhi, India",
    avatar: "/placeholder.svg",
    bio: "Mobile development expert with cross-platform expertise.",
    completedProjects: 28,
    experience: "4+ years"
  }
];

const FindTalent = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleContactFreelancer = (freelancer: any) => {
    setSelectedFreelancer(freelancer);
    setIsContactModalOpen(true);
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
              <Link to="/" className="text-xl font-bold text-gray-900">FreelanceHub</Link>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/find-talent" className="text-blue-600 font-medium">Find Talent</Link>
              <Link to="/find-work" className="text-gray-600 hover:text-blue-600">Find Work</Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-600">About</Link>
              <Link to="/profile" className="text-gray-600 hover:text-blue-600">Profile</Link>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </nav>
            <MobileNav currentPath={location.pathname} />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Talent</h1>
          <p className="text-gray-600">Discover skilled freelancers for your projects</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search freelancers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="writing">Writing</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rating</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
                <SelectItem value="rate-low">Lowest Rate</SelectItem>
                <SelectItem value="rate-high">Highest Rate</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Freelancer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockFreelancers.map((freelancer) => (
            <Card key={freelancer.id} className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={freelancer.avatar} />
                    <AvatarFallback>
                      {freelancer.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{freelancer.name}</CardTitle>
                    <CardDescription className="text-blue-600 font-medium">
                      {freelancer.title}
                    </CardDescription>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">{freelancer.rating}</span>
                      <span className="text-gray-500 text-sm ml-1">({freelancer.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">{freelancer.bio}</p>
                
                <div className="flex flex-wrap gap-2">
                  {freelancer.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {freelancer.location}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {freelancer.completedProjects} projects
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-lg font-bold text-blue-600">{freelancer.rate}</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleContactFreelancer(freelancer)}
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Contact
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <FreelancerContactModal
        freelancer={selectedFreelancer}
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};

export default FindTalent;
