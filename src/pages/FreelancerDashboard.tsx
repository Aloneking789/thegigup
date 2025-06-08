import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Clock, 
  DollarSign, 
  Eye, 
  Heart, 
  Send,
  Briefcase,
  User,
  Calendar,
  TrendingUp,
  MessageSquare,
  Settings,
  FileText,
  Award,
  LogOut,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { freelancerService } from "@/lib/api/client";
import { 
  FreelancerProfile, 
  AssignedProject, 
  FreelancerApplication, 
  PublicJobItem
} from "@/lib/api/types";
import { logout, isLoggedIn } from "@/lib/config/api";
import JobDetailModal from "@/components/JobDetailModal";
import MobileNav from "@/components/MobileNav";

const mockJobs = [
  {
    id: 1,
    title: "React Frontend Developer",
    company: "TechStart Solutions",
    location: "Remote",
    budget: "₹50,000 - ₹75,000",
    type: "Fixed Price",
    description: "Looking for an experienced React developer to build a modern web application with TypeScript...",
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
    postedDate: "2024-01-15",
    proposals: 12,
    clientRating: 4.8,
    isUrgent: true,
    isExperienced: false
  },
  {
    id: 2,
    title: "UI/UX Designer for Mobile App",
    company: "Creative Agency",
    location: "Mumbai, India",
    budget: "₹1,200/hour",
    type: "Hourly",
    description: "Need a creative designer to design user interface for a mobile application in fintech domain...",
    skills: ["Figma", "UI Design", "Mobile Design", "Prototyping"],
    postedDate: "2024-01-14",
    proposals: 8,
    clientRating: 4.9,
    isUrgent: false,
    isExperienced: true
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "E-commerce Startup",
    location: "Bangalore, India",
    budget: "₹80,000 - ₹120,000",
    type: "Fixed Price",
    description: "Build a complete e-commerce platform with modern tech stack including payment integration...",
    skills: ["React", "Node.js", "MongoDB", "Stripe"],
    postedDate: "2024-01-13",
    proposals: 25,
    clientRating: 4.7,
    isUrgent: true,
    isExperienced: true
  }
];

const FreelancerDashboard = () => {
  const [activeTab, setActiveTab] = useState("jobs");
  const [searchTerm, setSearchTerm] = useState("");
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<PublicJobItem | null>(null);
  const [showJobDetailModal, setShowJobDetailModal] = useState(false);
  
  // API state
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [publicJobs, setPublicJobs] = useState<PublicJobItem[]>([]);
  const [assignedProjects, setAssignedProjects] = useState<AssignedProject[]>([]);
  const [applications, setApplications] = useState<FreelancerApplication[]>([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [isLoadingAssigned, setIsLoadingAssigned] = useState(true);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);  const [profileError, setProfileError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  // Calculate profile completion percentage based on actual data
  const calculateProfileCompletion = (profile: FreelancerProfile | null) => {
    if (!profile) return 0;
    
    let completedFields = 0;
    const totalFields = 8; // Updated to match new API fields
    
    // Check name
    if (profile.name) completedFields++;
    
    // Check bio
    if (profile.bio) completedFields++;
    
    // Check location
    if (profile.location) completedFields++;
    
    // Check age
    if (profile.age) completedFields++;
    
    // Check skills
    if (profile.skills && profile.skills.length > 0) completedFields++;
    
    // Check experience
    if (profile.experience) completedFields++;
    
    // Check hourly rate
    if (profile.hourlyRate) completedFields++;
    
    // Check professional links (at least one)
    if (profile.linkedinUrl || profile.portfolioUrl || profile.githubUrl) completedFields++;
    
    return Math.round((completedFields / totalFields) * 100);
  };

  // Check if profile is sufficiently complete to show jobs
  const isProfileSufficientlyComplete = (profile: FreelancerProfile | null) => {
    if (!profile) return false;
    return calculateProfileCompletion(profile) >= 60; // At least 60% complete
  };  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoadingProfile(true);
        setProfileError(null);        // Try to fetch real profile data
        try {
          const response = await freelancerService.getProfile();
          if (response.success && response.data) {
            const profileData = response.data;
            const freelancerData = profileData.freelancer;
            
            // Map the API response to FreelancerProfile format
            const mappedProfile: FreelancerProfile = {
              id: profileData.id || '',
              userId: freelancerData?.userId || '',
              // New simplified fields from the nested freelancer object
              name: profileData.name || '',
              bio: profileData.bio || '',
              location: profileData.location || '',
              age: freelancerData?.age || 0,
              skills: freelancerData?.skills || [],
              experience: freelancerData?.experience || '',
              hourlyRate: freelancerData?.hourlyRate || 0,
              availability: freelancerData?.availability || false,
              githubUrl: freelancerData?.githubUrl || '',
              linkedinUrl: freelancerData?.linkedinUrl || '',
              portfolioUrl: freelancerData?.portfolioUrl || '',
              // Legacy fields for compatibility
              title: '',
              overview: profileData.bio || '',
              languages: [],
              education: [],
              portfolio: [],
              resume: '',
              completionStatus: {
                basicInfo: !!(profileData.name) && !!(profileData.bio),
                skills: !!(freelancerData?.skills && freelancerData.skills.length > 0),
                experience: !!freelancerData?.experience,
                education: false,
                portfolio: false
              },
              createdAt: profileData.createdAt || '',
              updatedAt: profileData.updatedAt || ''
            };
            setProfile(mappedProfile);
          } else {
            throw new Error('Profile not found');
          }} catch (error) {
          // Fallback to mock profile data if API fails
          console.log('Using mock profile data:', error);
          const mockProfile: FreelancerProfile = {
            id: "1",
            userId: "1",
            name: "John Doe",
            bio: "Experienced developer with 5+ years in web development",
            location: "Mumbai, India",
            age: 28,
            skills: ["React", "TypeScript", "Node.js", "Python"],
            experience: "5 years",
            hourlyRate: 75,
            availability: true,
            githubUrl: "https://github.com/johndoe",
            linkedinUrl: "https://linkedin.com/in/johndoe",
            portfolioUrl: "https://johndoe.dev",
            // Legacy fields for compatibility
            title: "Full Stack Developer",
            overview: "Experienced developer with 5+ years in web development",
            languages: ["English", "Hindi"],
            education: [],
            portfolio: [],
            resume: "",
            completionStatus: {
              basicInfo: true,
              skills: true,
              experience: true,
              education: false,
              portfolio: false
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setProfile(mockProfile);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setProfileError(error instanceof Error ? error.message : 'Failed to load profile');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  // Fetch public jobs
  useEffect(() => {
    const fetchJobs = async () => {
      if (!profile || !isProfileSufficientlyComplete(profile)) {
        setPublicJobs([]);
        setIsLoadingJobs(false);
        return;
      }

      try {
        setIsLoadingJobs(true);
        const response = await freelancerService.getPublicJobs(1, 12);
        if (response.success) {
          setPublicJobs(response.data.jobs);
        }
      } catch (error) {
        console.error('Failed to fetch public jobs:', error);
        toast({
          title: "Error",
          description: "Failed to load available jobs",
          variant: "destructive"
        });
      } finally {
        setIsLoadingJobs(false);
      }
    };

    if (!isLoadingProfile) {
      fetchJobs();
    }
  }, [profile, isLoadingProfile, toast]);  // Fetch assigned projects
  useEffect(() => {
    const fetchAssignedProjects = async () => {
      try {
        setIsLoadingAssigned(true);
        const response = await freelancerService.getAssignedProjects(1, 10);
        if (response.success) {
          setAssignedProjects(response.data.projects);        } else {
          setAssignedProjects([]);
          toast({
            title: "Error",
            description: "Failed to load assigned projects",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Failed to fetch assigned projects:', error);
        setAssignedProjects([]);
        toast({
          title: "Error",
          description: "Failed to load assigned projects. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingAssigned(false);
      }
    };

    if (!isLoadingProfile) {
      fetchAssignedProjects();
    }
  }, [isLoadingProfile, toast]);

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoadingApplications(true);
        const response = await freelancerService.getApplications('', 1, 10);
        if (response.success) {
          setApplications(response.data.applications);
        }
      } catch (error) {
        console.error('Failed to fetch applications:', error);
        toast({
          title: "Error",
          description: "Failed to load applications",
          variant: "destructive"
        });
      } finally {
        setIsLoadingApplications(false);
      }
    };

    if (!isLoadingProfile) {
      fetchApplications();
    }  }, [isLoadingProfile, toast]);

  const profileCompletion = calculateProfileCompletion(profile);
  const isProfileComplete = isProfileSufficientlyComplete(profile);

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };
  const handleViewDetails = (job: PublicJobItem) => {
    setSelectedJob(job);
    setShowJobDetailModal(true);
  };  const handleRequestCompletion = async (projectId: string) => {
    try {
      const response = await freelancerService.requestCompletion(projectId);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Completion request has been sent to the client successfully!",
        });
        // Refresh assigned projects to update status
        const refreshResponse = await freelancerService.getAssignedProjects(1, 10);
        if (refreshResponse.success) {
          setAssignedProjects(refreshResponse.data.projects);
        }
      } else {
        throw new Error(response.message || 'Failed to request completion');
      }
    } catch (error) {
      console.error('Error requesting completion:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to request completion. Please try again.",
        variant: "destructive",
      });
    }
  };
  const handleCompleteProfile = () => {
    // If profile is sufficiently complete (90%+), navigate to edit profile
    // Otherwise, navigate to profile setup
    if (profileCompletion >= 90) {
      navigate('/edit-profile');
    } else {
      navigate('/freelancer-profile-setup');
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
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
            </div>            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                Messages
              </Button>
 
              {isLoggedIn() && (
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              )}
              <Avatar className="cursor-pointer" onClick={handleProfileClick}>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>RP</AvatarFallback>
              </Avatar>
            </div>
          </div>        </div>
      </header>

      <MobileNav 
        userLoggedIn={true}
        userRole="FREELANCER"
        userProfile={profile ? {
          name: profile.profile?.name || 'User',
          email: profile.profile?.email || '',
          profileImage: profile.profile?.profileImage
        } : undefined}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Freelancer Dashboard</h1>
          <p className="text-gray-600">Find your next opportunity and manage your freelance career</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">          <TabsList className="grid w-full grid-cols-5 bg-white border border-gray-200">
            <TabsTrigger value="jobs">Find Jobs</TabsTrigger>
            <TabsTrigger value="assigned">Assigned Jobs</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList><TabsContent value="jobs" className="space-y-6">
            {!isProfileComplete ? (
              /* Profile Completion Prompt */
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardContent className="p-8 text-center">
                  <User className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile to Find Jobs</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Your profile is {profileCompletion}% complete. Complete at least 60% of your profile to start seeing job recommendations.
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-6 max-w-sm mx-auto">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${profileCompletion}%` }}
                    ></div>
                  </div>
                  <Button 
                    onClick={handleCompleteProfile}
                    className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
                  >
                    Complete Profile Now
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search jobs by title, skills, or company..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="border-gray-200">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" className="border-gray-200">
                      Sort by: Latest
                    </Button>
                  </div>
                </div>                {/* Loading State */}
                {isLoadingJobs && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading available projects...</p>
                  </div>
                )}

                {/* Job Listings */}
                {!isLoadingJobs && (
                  <div className="grid gap-6">
                    {publicJobs.length === 0 ? (
                      <Card className="bg-white border-gray-200">
                        <CardContent className="p-8 text-center">
                          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Available</h3>
                          <p className="text-gray-600">
                            There are no matching jobs available at the moment. Check back later for new opportunities.
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      publicJobs                        .filter(project => 
                          searchTerm === "" || 
                          project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.skillsRequired?.some(skill => 
                            skill.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                        )
                        .map((project) => (
                          <Card key={project.id} className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                              <div className="space-y-4">
                                {/* Header */}
                                <div className="flex justify-between items-start">
                                  <div className="space-y-2">                                    <div className="flex items-center gap-2">
                                      <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                                      {/* Remove isUrgent and isExperienced as they don't exist in PublicJobItem type */}
                                    </div>                                    <div className="flex items-center text-gray-600 text-sm space-x-4">
                                      <span className="font-medium">{project.client.company}</span>
                                      <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        <span>{project.client.location || 'Remote'}</span>
                                      </div><div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-1" />
                                        <span>Posted {new Date(project.postedAt).toLocaleDateString()}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleSaveJob(project.id)}
                                    className={savedJobs.includes(project.id) ? "text-red-500" : "text-gray-400"}
                                  >
                                    <Heart className={`w-4 h-4 ${savedJobs.includes(project.id) ? 'fill-current' : ''}`} />
                                  </Button>
                                </div>

                                {/* Budget and Type */}
                                <div className="flex items-center space-x-6">
                                  <div className="flex items-center">
                                    <DollarSign className="w-4 h-4 mr-1 text-green-600" />                                    <span className="font-semibold text-gray-900">
                                      ₹{project.budget.min.toLocaleString()} - ₹{project.budget.max.toLocaleString()}
                                    </span>
                                    <span className="text-gray-500 ml-1">({project.duration})</span>
                                  </div>                                  <div className="flex items-center text-sm text-gray-600">
                                    <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                                    <span>Client rating: {project.client.ratings || 'New client'}</span>
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {project.applicationsCount || 0} applications
                                  </div>
                                </div>                                {/* Description */}
                                <p className="text-gray-600 line-clamp-2">{project.description}</p>

                                {/* Skills */}                                <div className="flex flex-wrap gap-2">
                                  {project.skillsRequired?.map((skill) => (
                                    <Badge key={skill} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>                                {/* Actions */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="border-gray-200"
                                    onClick={() => handleViewDetails(project)}
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    View Details
                                  </Button>
                                  
                                  <Button 
                                    className="bg-blue-600 hover:bg-blue-700"
                                    onClick={() => handleViewDetails(project)}
                                  >
                                    <Send className="w-4 h-4 mr-2" />
                                    Send Proposal
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                    )}
                  </div>
                )}
              </>            )}
          </TabsContent>

          <TabsContent value="assigned" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Assigned Jobs</h2>
              <div className="text-sm text-gray-600">
                {assignedProjects.length} active projects
              </div>
            </div>

            {/* Loading State */}
            {isLoadingAssigned && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading assigned projects...</p>
              </div>
            )}

            {/* Assigned Projects */}
            {!isLoadingAssigned && (
              <div className="grid gap-6">
                {assignedProjects.length === 0 ? (
                  <Card className="bg-white border-gray-200">
                    <CardContent className="p-8 text-center">
                      <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Assigned Projects</h3>
                      <p className="text-gray-600 mb-6">
                        You don't have any assigned projects yet. Start applying to jobs to get your first project.
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setActiveTab("jobs")}>
                        <Search className="w-4 h-4 mr-2" />
                        Find Jobs
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  assignedProjects.map((project) => (
                    <Card key={project.id} className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>                                <Badge className={
                                  project.status === 'IN_PROGRESS' 
                                    ? "bg-green-100 text-green-800"
                                    : project.status === 'COMPLETED'
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }>
                                  {project.status}
                                </Badge>
                              </div>                              <div className="flex items-center text-gray-600 text-sm space-x-4">
                                <span className="font-medium">{project.client.user.name}</span>                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                                </div>                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold text-gray-900">
                                ₹{project.budgetMin.toLocaleString()} - ₹{project.budgetMax.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-600">{project.duration}</div>
                            </div>
                          </div>

                          {/* Progress */}                          {/* Description */}
                          <p className="text-gray-600 line-clamp-2">{project.description}</p>

                          {/* Skills */}                          <div className="flex flex-wrap gap-2">
                            {project.skillsRequired?.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>                          {/* Actions */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="border-gray-200">
                                <Eye className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                              <Button variant="outline" size="sm" className="border-gray-200">
                                <MessageSquare className="w-4 h-4 mr-1" />
                                Message Client
                              </Button>
                              {project.status === 'ASSIGNED' && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-green-200 text-green-700 hover:bg-green-50"
                                  onClick={() => handleRequestCompletion(project.id)}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Request Completion
                                </Button>
                              )}
                            </div>
                            {project.status === 'COMPLETED' && (
                              <Button variant="outline" size="sm" className="border-gray-200">
                                <FileText className="w-4 h-4 mr-1" />
                                View Invoice
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </TabsContent>          <TabsContent value="applications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
              <div className="text-sm text-gray-600">
                {applications.length} applications submitted
              </div>
            </div>

            {/* Loading State */}
            {isLoadingApplications && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading applications...</p>
              </div>
            )}

            {/* Applications */}
            {!isLoadingApplications && (
              <div className="grid gap-4">
                {applications.length === 0 ? (
                  <Card className="bg-white border-gray-200">
                    <CardContent className="p-8 text-center">
                      <Send className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
                      <p className="text-gray-600 mb-6">
                        Start applying to jobs to track your applications here.
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setActiveTab("jobs")}>
                        <Search className="w-4 h-4 mr-2" />
                        Find Jobs
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  applications.map((application) => (
                    <Card key={application.id} className="bg-white border-gray-200">
                      <CardContent className="p-6">                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-900">{application.project.title}</h3>
                            <p className="text-gray-600">{application.project.client.user.name}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span>Applied {new Date(application.createdAt).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                <span>Budget: ₹{application.project.budgetMin.toLocaleString()} - ₹{application.project.budgetMax.toLocaleString()}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{application.proposal}</p>
                          </div>
                          <div className="text-right">
                            <Badge 
                              className={
                                application.status === "APPROVED" 
                                  ? "bg-green-100 text-green-800"
                                  : application.status === "REJECTED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {application.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </TabsContent><TabsContent value="profile" className="space-y-6">
            {/* Profile Completion */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle>Profile Completion</CardTitle>
                <CardDescription>Complete your profile to get more opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                    <span className="text-sm text-gray-500">{profileCompletion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${profileCompletion}%` }}
                    ></div>
                  </div>                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        profile?.name && profile?.bio ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      Basic information (name & bio) {profile?.name && profile?.bio ? 'completed' : 'needed'}
                    </div>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        profile?.location ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      Location {profile?.location ? 'added' : 'needed'}
                    </div>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        profile?.age ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      Age {profile?.age ? 'added' : 'optional'}
                    </div>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        profile?.skills && profile.skills.length > 0 ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      Skills {profile?.skills && profile.skills.length > 0 ? 'added' : 'needed'}
                    </div>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        profile?.experience ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      Experience {profile?.experience ? 'added' : 'needed'}
                    </div>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        profile?.hourlyRate ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      Hourly rate {profile?.hourlyRate ? 'set' : 'needed'}
                    </div>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        profile?.linkedinUrl || profile?.portfolioUrl || profile?.githubUrl ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      Professional links {profile?.linkedinUrl || profile?.portfolioUrl || profile?.githubUrl ? 'added' : 'recommended'}
                    </div>
                  </div>
                  <Button 
                    onClick={handleCompleteProfile}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {profileCompletion >= 90 ? 'Edit Profile' : 'Complete Profile'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Profile Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                  <Eye className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">127</div>
                  <p className="text-xs text-gray-600">This month</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profile Rating</CardTitle>
                  <Star className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.9</div>
                  <p className="text-xs text-gray-600">Based on 23 reviews</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92%</div>
                  <p className="text-xs text-gray-600">Project completion</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹000</div>
                  <p className="text-xs text-gray-600">All time</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Month</CardTitle>
                  <Calendar className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹000</div>
                  <p className="text-xs text-gray-600">+15% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available</CardTitle>
                  <Award className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹000</div>
                  <p className="text-xs text-gray-600">Ready to withdraw</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Rate</CardTitle>
                  <Clock className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹00</div>
                  <p className="text-xs text-gray-600">Average rate</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recent payments to show</p>
                </div>
              </CardContent>            </Card>
          </TabsContent>        </Tabs>
      </div>
      
      {/* Job Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        isOpen={showJobDetailModal}
        onClose={() => {
          setShowJobDetailModal(false);
          setSelectedJob(null);
        }}
        showProposalForm={true}
      />
    </div>
  );
};

export default FreelancerDashboard;
