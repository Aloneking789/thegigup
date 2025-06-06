
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  DollarSign, 
  Eye, 
  Send,
  Briefcase,
  Settings,
  Star,
  Users,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockJobs = [
  {
    id: 1,
    title: "React Frontend Developer",
    company: "TechStart Solutions",
    location: "Remote",
    budget: "₹50,000 - ₹75,000",
    type: "Fixed Price",
    description: "Looking for an experienced React developer to build a modern web application with TypeScript and Tailwind CSS. The project involves creating a responsive dashboard with real-time data visualization.",
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
    postedDate: "2024-01-15",
    proposals: 12,
    clientRating: 4.8,
    clientReviews: 23,
    isUrgent: true,
    isExperienced: false,
    timePosted: "2 hours ago",
    aboutClient: "TechStart Solutions is a growing startup focused on building innovative B2B solutions. We value quality code and collaborative teamwork."
  },
  {
    id: 2,
    title: "UI/UX Designer for Mobile App",
    company: "Creative Agency",
    location: "Mumbai, India",
    budget: "₹1,200/hour",
    type: "Hourly",
    description: "Need a creative designer to design user interface for a mobile application in fintech domain. Must have experience with financial apps and modern design principles.",
    skills: ["Figma", "UI Design", "Mobile Design", "Prototyping"],
    postedDate: "2024-01-14",
    proposals: 8,
    clientRating: 4.9,
    clientReviews: 45,
    isUrgent: false,
    isExperienced: true,
    timePosted: "1 day ago",
    aboutClient: "Creative Agency with 10+ years of experience in digital design. We work with Fortune 500 companies and emerging startups."
  }
];

const FindWork = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("latest");

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
              <Link to="/find-talent" className="text-gray-600 hover:text-blue-600">Find Talent</Link>
              <Link to="/find-work" className="text-blue-600 font-medium">Find Work</Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-600">About</Link>
              <Link to="/profile" className="text-gray-600 hover:text-blue-600">Profile</Link>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Work</h1>
          <p className="text-gray-600">Discover opportunities that match your skills</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search jobs..."
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
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="budget-high">Highest Budget</SelectItem>
                <SelectItem value="budget-low">Lowest Budget</SelectItem>
                <SelectItem value="proposals">Fewest Proposals</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {mockJobs.map((job) => (
            <Card key={job.id} className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                        {job.isUrgent && (
                          <Badge className="bg-red-100 text-red-800">URGENT</Badge>
                        )}
                        {job.isExperienced && (
                          <Badge className="bg-purple-100 text-purple-800">EXPERIENCED</Badge>
                        )}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm space-x-4">
                        <span className="font-medium">{job.company}</span>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{job.timePosted}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Budget and Type */}
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                      <span className="font-semibold text-gray-900">{job.budget}</span>
                      <span className="text-gray-500 ml-1">({job.type})</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                      <span>Client rating: {job.clientRating} ({job.clientReviews} reviews)</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {job.proposals} proposals
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600">{job.description}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  {/* About Client */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">About the Client</h4>
                    <p className="text-sm text-gray-600">{job.aboutClient}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <Button variant="outline" size="sm" className="border-gray-200">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Send className="w-4 h-4 mr-2" />
                      Send Proposal
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindWork;
