
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  DollarSign, 
  Users, 
  Star,
  MapPin,
  Eye,
  Bell,
  Settings,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  const myJobs = [
    {
      id: 1,
      title: "React Developer for E-commerce Website",
      budget: 25000,
      applicants: 12,
      status: "active",
      postedDate: "2 days ago",
      deadline: "1 week",
      skills: ["React", "Node.js", "MongoDB"]
    },
    {
      id: 2,
      title: "UI/UX Designer for Mobile App",
      budget: 15000,
      applicants: 8,
      status: "in-progress",
      postedDate: "1 week ago",
      deadline: "2 weeks",
      skills: ["Figma", "Adobe XD", "Prototyping"]
    }
  ];

  const topApplicants = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Full Stack Developer",
      rating: 4.9,
      hourlyRate: 1200,
      location: "Mumbai, India",
      proposal: "I have 5+ years of experience in React development...",
      skills: ["React", "Node.js", "MongoDB"]
    },
    {
      id: 2,
      name: "Arjun Patel",
      role: "UI/UX Designer",
      rating: 4.8,
      hourlyRate: 800,
      location: "Bangalore, India",
      proposal: "I can create beautiful and intuitive user interfaces...",
      skills: ["Figma", "Adobe XD", "Sketch"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <Briefcase className="w-8 h-8 text-blue-600" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FreelanceHub
                </h1>
              </Link>
              <Badge className="bg-blue-100 text-blue-700">Client</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-6">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "overview" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Briefcase className="w-5 h-5" />
                  <span>Overview</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab("jobs")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "jobs" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Search className="w-5 h-5" />
                  <span>My Jobs</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab("applicants")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "applicants" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5" />
                  <span>Applicants</span>
                </div>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Post New Job
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Active Jobs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">5</div>
                    <p className="text-sm text-gray-500">+2 from last month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Applicants</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">47</div>
                    <p className="text-sm text-gray-500">Across all jobs</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Budget Spent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">₹1,25,000</div>
                    <p className="text-sm text-gray-500">This month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Jobs */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Job Posts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {myJobs.slice(0, 2).map((job) => (
                    <div key={job.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <Badge 
                          variant={job.status === "active" ? "default" : "secondary"}
                          className={job.status === "active" ? "bg-green-100 text-green-700" : ""}
                        >
                          {job.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          ₹{job.budget.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {job.applicants} applicants
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {job.postedDate}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill) => (
                          <Badge key={skill} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "jobs" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">My Job Posts</h2>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Post New Job
                </Button>
              </div>

              <div className="space-y-4">
                {myJobs.map((job) => (
                  <Card key={job.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-xl mb-2">{job.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              ₹{job.budget.toLocaleString()}
                            </span>
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {job.applicants} applicants
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              Deadline: {job.deadline}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={job.status === "active" ? "default" : "secondary"}
                            className={job.status === "active" ? "bg-green-100 text-green-700" : ""}
                          >
                            {job.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill) => (
                          <Badge key={skill} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "applicants" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Recent Applicants</h2>
              
              <div className="space-y-4">
                {topApplicants.map((applicant) => (
                  <Card key={applicant.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <img
                            src="/placeholder.svg"
                            alt={applicant.name}
                            className="w-16 h-16 rounded-full object-cover border-4 border-blue-100"
                          />
                          <div>
                            <h3 className="font-semibold text-lg">{applicant.name}</h3>
                            <p className="text-gray-600">{applicant.role}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                              <span className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                {applicant.rating}
                              </span>
                              <span className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                ₹{applicant.hourlyRate}/hr
                              </span>
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {applicant.location}
                              </span>
                            </div>
                            
                            <p className="text-gray-700 mt-3 max-w-md">{applicant.proposal}</p>
                            
                            <div className="flex flex-wrap gap-2 mt-3">
                              {applicant.skills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="bg-blue-100 text-blue-700">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Accept
                          </Button>
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;
