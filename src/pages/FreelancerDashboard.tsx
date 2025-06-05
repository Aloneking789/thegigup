
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Briefcase, 
  Search, 
  Filter, 
  Clock, 
  DollarSign, 
  Star,
  MapPin,
  User,
  Award,
  TrendingUp,
  Bell,
  Settings,
  LogOut,
  Plus,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const FreelancerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const jobListings = [
    {
      id: 1,
      title: "React Developer for E-commerce Website",
      client: "TechCorp Solutions",
      budget: "₹20,000 - ₹35,000",
      type: "Fixed Price",
      deadline: "2 weeks",
      posted: "2 hours ago",
      location: "Remote",
      skills: ["React", "Node.js", "MongoDB"],
      tags: ["URGENT", "VERIFIED_CLIENT"],
      description: "Looking for an experienced React developer to build a modern e-commerce platform..."
    },
    {
      id: 2,
      title: "UI/UX Designer for Mobile App",
      client: "StartupXYZ",
      budget: "₹800/hr",
      type: "Hourly",
      deadline: "1 month",
      posted: "5 hours ago",
      location: "Bangalore",
      skills: ["Figma", "Adobe XD", "Prototyping"],
      tags: ["EXPERIENCED"],
      description: "We need a creative UI/UX designer to design our mobile application..."
    }
  ];

  const appliedJobs = [
    {
      id: 1,
      title: "Full Stack Developer for SaaS Platform",
      client: "InnovateTech",
      status: "Under Review",
      appliedDate: "3 days ago",
      budget: "₹50,000"
    },
    {
      id: 2,
      title: "Frontend Developer - React",
      client: "WebSolutions Inc",
      status: "Interview Scheduled",
      appliedDate: "1 week ago",
      budget: "₹30,000"
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
              <Badge className="bg-purple-100 text-purple-700">Freelancer</Badge>
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
                  activeTab === "overview" ? "bg-purple-50 text-purple-700" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5" />
                  <span>Overview</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab("jobs")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "jobs" ? "bg-purple-50 text-purple-700" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Search className="w-5 h-5" />
                  <span>Find Jobs</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab("applied")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "applied" ? "bg-purple-50 text-purple-700" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5" />
                  <span>Applied Jobs</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "profile" ? "bg-purple-50 text-purple-700" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5" />
                  <span>My Profile</span>
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
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Upgrade to Plus
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Profile Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">85%</div>
                    <Progress value={85} className="mt-2" />
                    <p className="text-sm text-gray-500 mt-1">Complete your profile</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Jobs Applied</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <p className="text-sm text-gray-500">This month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Earnings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">₹45,000</div>
                    <p className="text-sm text-gray-500">Last 30 days</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Rating</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div className="text-2xl font-bold text-yellow-600">4.8</div>
                      <Star className="w-5 h-5 text-yellow-400 fill-current ml-1" />
                    </div>
                    <p className="text-sm text-gray-500">Based on 15 reviews</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col">
                      <User className="w-6 h-6 mb-2" />
                      Complete Profile
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col">
                      <Plus className="w-6 h-6 mb-2" />
                      Add Project
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col">
                      <Award className="w-6 h-6 mb-2" />
                      Get Verified
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {appliedJobs.slice(0, 2).map((job) => (
                    <div key={job.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{job.title}</h3>
                        <Badge 
                          variant={job.status === "Interview Scheduled" ? "default" : "secondary"}
                          className={job.status === "Interview Scheduled" ? "bg-green-100 text-green-700" : ""}
                        >
                          {job.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Client: {job.client}</span>
                        <span>Budget: {job.budget}</span>
                        <span>Applied: {job.appliedDate}</span>
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
                <h2 className="text-2xl font-bold text-gray-800">Find Jobs</h2>
                <div className="flex items-center space-x-2">
                  <Input placeholder="Search jobs..." className="w-64" />
                  <Button variant="outline">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {jobListings.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-xl">{job.title}</h3>
                            {job.tags.map((tag) => (
                              <Badge 
                                key={tag} 
                                variant="secondary"
                                className={
                                  tag === "URGENT" ? "bg-red-100 text-red-700" :
                                  tag === "VERIFIED_CLIENT" ? "bg-green-100 text-green-700" :
                                  "bg-blue-100 text-blue-700"
                                }
                              >
                                {tag.replace("_", " ")}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              {job.budget}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {job.deadline}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location}
                            </span>
                            <span>Posted: {job.posted}</span>
                          </div>
                          
                          <p className="text-gray-700 mb-4">{job.description}</p>
                          
                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill) => (
                              <Badge key={skill} variant="outline">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="ml-6">
                          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                            Apply Now
                          </Button>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <p className="text-sm text-gray-600">Client: <span className="font-medium">{job.client}</span></p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "applied" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Applied Jobs</h2>
              
              <div className="space-y-4">
                {appliedJobs.map((job) => (
                  <Card key={job.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <p className="text-gray-600">Client: {job.client}</p>
                        </div>
                        <Badge 
                          variant={job.status === "Interview Scheduled" ? "default" : "secondary"}
                          className={job.status === "Interview Scheduled" ? "bg-green-100 text-green-700" : ""}
                        >
                          {job.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {job.budget}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Applied: {job.appliedDate}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
              
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <img
                      src="/placeholder.svg"
                      alt="Profile"
                      className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-purple-100"
                    />
                    <h3 className="text-xl font-semibold">John Doe</h3>
                    <p className="text-gray-600">Full Stack Developer</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <p className="text-gray-600">
                        Experienced full stack developer with 5+ years of experience in React, Node.js, and modern web technologies.
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                      <div className="flex flex-wrap gap-2">
                        {["React", "Node.js", "TypeScript", "Python", "MongoDB"].map((skill) => (
                          <Badge key={skill} variant="secondary" className="bg-purple-100 text-purple-700">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
