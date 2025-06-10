import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  DollarSign,
  Clock,
  Briefcase,
  Star,
  MessageSquare,
  Settings,
  LogOut,
  Check,
  X,
  Award,
  ExternalLink,
  Mail,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { isLoggedIn, logout, RoleStorage } from "@/lib/config/api";
import { clientService } from "@/lib/api/client";
import { 
  ClientProject, 
  ClientDashboardStats, 
  ClientDashboardResponse,
  ClientProjectApplication,
  ClientApplicationsResponse
} from "@/lib/api/types";
import RatingModal from "@/components/RatingModal";
import MobileNav from "@/components/MobileNav";

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>("all");
  const [selectedApplicant, setSelectedApplicant] = useState<ClientProjectApplication | null>(null);
  const [isApplicantModalOpen, setIsApplicantModalOpen] = useState(false);
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [applications, setApplications] = useState<ClientProjectApplication[]>([]);
  const [dashboardStats, setDashboardStats] = useState<ClientDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProjectsLoading, setIsProjectsLoading] = useState(false);
  const [isApplicationsLoading, setIsApplicationsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const [ratingModal, setRatingModal] = useState<{
    isOpen: boolean;
    projectId: string;
    projectTitle: string;
  }>({
    isOpen: false,
    projectId: "",
    projectTitle: ""
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is a client, redirect if not
  useEffect(() => {
    if (!isLoggedIn() || !RoleStorage.isClient()) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
    fetchApplications();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching dashboard data...');
      const response = await clientService.getDashboardData();
      console.log('Dashboard data response:', response);
      
      if (response.success) {
        setProjects(response.data.client.projects);
        setDashboardStats({
          totalProjects: response.data.stats.totalProjects,
          openProjects: response.data.stats.openProjects,
          assignedProjects: response.data.stats.assignedProjects,
          completedProjects: response.data.stats.completedProjects,
          pendingApplications: response.data.stats.pendingApplications
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // For development/demo purposes, set some mock data to show the UI
      setProjects([]);
      setDashboardStats({
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        totalSpent: 0,
        freelancersHired: 0,
        averageProjectRating: 0
      });
      
      toast({
        title: "API Connection Issue",
        description: "Using demo mode. Connect to backend API for real data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setIsApplicationsLoading(true);
      console.log('Fetching applications...');
      const response = await clientService.getApplications(1, 50);
      console.log('Applications response:', response);
      
      if (response.success) {
        setApplications(response.data.applications);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      setApplications([]);
      
      toast({
        title: "API Connection Issue",
        description: "Failed to load applications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApplicationsLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      setIsProjectsLoading(true);
      console.log('Fetching projects...');
      const response = await clientService.getProjects();
      console.log('Projects response:', response);
      
      if (response.success) {
        setProjects(response.data.projects);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setProjects([]);
      
      toast({
        title: "API Connection Issue",
        description: "Using demo mode. Connect to backend API for real data.",
        variant: "destructive",
      });
    } finally {
      setIsProjectsLoading(false);
    }
  };

  const handlePostNewJob = () => {
    navigate("/post-job");
  };

  const handleBrowseFreelancers = () => {
    navigate("/find-talent");
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

  // Application Management
  const handleApproveApplication = async (projectId: string, applicationId: string) => {
    try {
      setIsActionLoading(`approve-${applicationId}`);
      const response = await clientService.approveApplication(projectId, applicationId);
      if (response.success) {
        toast({
          title: "Application Approved",
          description: "The application has been approved successfully.",
        });
        await fetchDashboardData();
        await fetchApplications();
      }
    } catch (error) {
      console.error('Failed to approve application:', error);
      toast({
        title: "Error",
        description: "Failed to approve application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleRejectApplication = async (projectId: string, applicationId: string) => {
    try {
      setIsActionLoading(`reject-${applicationId}`);
      const response = await clientService.rejectApplication(projectId, applicationId);
      if (response.success) {
        toast({
          title: "Application Rejected",
          description: "The application has been rejected.",
        });
        await fetchDashboardData();
        await fetchApplications();
      }
    } catch (error) {
      console.error('Failed to reject application:', error);
      toast({
        title: "Error",
        description: "Failed to reject application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleApproveCompletion = async (projectId: string) => {
    try {
      setIsActionLoading(`approve-completion-${projectId}`);
      const response = await clientService.approveCompletion(projectId);
      
      if (response.success) {
        toast({
          title: "Completion Approved",
          description: "Project completion has been approved. You can now rate the freelancer.",
        });
        await fetchDashboardData();
        
        const project = projects.find(p => p.id === projectId);
        if (project) {
          setRatingModal({
            isOpen: true,
            projectId: projectId,
            projectTitle: project.title
          });
        }
      }
    } catch (error) {
      console.error('Failed to approve completion:', error);
      toast({
        title: "Error",
        description: "Failed to approve completion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(null);
    }
  };

  // Applicant Management
  const handleViewApplicantProfile = (applicant: ClientProjectApplication) => {
    const nameSlug = applicant.freelancer.user.name.toLowerCase().replace(/\s+/g, '-');
    const profileUrl = `/profile/${nameSlug}/${applicant.freelancer.userId}`;
    window.open(profileUrl, '_blank');
  };

  const handleOpenApplicantModal = (applicant: ClientProjectApplication) => {
    setSelectedApplicant(applicant);
    setIsApplicantModalOpen(true);
  };

  const handleCloseApplicantModal = () => {
    setSelectedApplicant(null);
    setIsApplicantModalOpen(false);
  };

  // Project filtering functions
  const getFilteredProjects = () => {
    const projectsWithApplications = getProjectsWithApplications();
    if (selectedProjectFilter === "all") {
      return projectsWithApplications;
    }
    return projectsWithApplications.filter(project => project.id === selectedProjectFilter);
  };

  const getProjectsWithApplications = () => {
    const projectIds = new Set(applications.map(app => app.projectId));
    return Array.from(projectIds).map(projectId => {
      const projectApplications = applications.filter(app => app.projectId === projectId);
      const firstApp = projectApplications[0];
      return {
        id: projectId,
        title: firstApp.project.title,
        description: firstApp.project.description,
        skillsRequired: firstApp.project.skillsRequired,
        budgetMin: firstApp.project.budgetMin,
        budgetMax: firstApp.project.budgetMax,
        status: firstApp.project.status,
        applications: projectApplications
      };
    });
  };

  const handleRateFreelancer = async (rating: number, review: string) => {
    try {
      setIsActionLoading(`rating-${ratingModal.projectId}`);
      const response = await clientService.rateFreelancer(ratingModal.projectId, rating, review);
      
      if (response.success) {
        toast({
          title: "Rating Submitted",
          description: "Thank you for rating the freelancer!",
        });
        setRatingModal({ isOpen: false, projectId: "", projectTitle: "" });
        await fetchDashboardData();
      }
    } catch (error) {
      console.error('Failed to submit rating:', error);
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(null);
    }
  };

  const formatBudget = (budgetMin: number, budgetMax: number) => {
    return `₹${budgetMin.toLocaleString()} - ₹${budgetMax.toLocaleString()}`;
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING_COMPLETION':
        return 'bg-orange-100 text-orange-800';
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.skillsRequired.some(skill => 
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
              </div>
              <Link to="/" className="text-lg sm:text-xl font-bold text-gray-900">TheGigUp</Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Messages
              </Button>
 
              {isLoggedIn() && (
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              )}
              <Avatar className="cursor-pointer" onClick={handleProfileClick}>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-2">
              <Avatar className="cursor-pointer w-8 h-8" onClick={handleProfileClick}>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-xs">JD</AvatarFallback>
              </Avatar>
              <MobileNav 
                userLoggedIn={true}
                userRole="CLIENT"
                userProfile={{
                  name: 'Client User',
                  email: '',
                  profileImage: '/placeholder.svg'
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 pb-20 sm:pb-8">
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Client Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your projects and find the perfect talent</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          {/* Mobile-Responsive Tabs */}
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 h-auto p-1">
            <TabsTrigger value="overview" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Home</span>
            </TabsTrigger>
            <TabsTrigger value="jobs" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <span className="hidden sm:inline">My Jobs</span>
              <span className="sm:hidden">Jobs</span>
            </TabsTrigger>
            <TabsTrigger value="applicants" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <span className="hidden sm:inline">Applicants</span>
              <span className="sm:hidden">Apps</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            {/* Mobile-Responsive Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
                  <CardTitle className="text-xs sm:text-sm font-medium">Active Jobs</CardTitle>
                  <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  <div className="text-lg sm:text-2xl font-bold">{dashboardStats?.activeProjects || 0}</div>
                  <p className="text-xs text-gray-600">Currently open</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
                  <CardTitle className="text-xs sm:text-sm font-medium">Applications</CardTitle>
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  <div className="text-lg sm:text-2xl font-bold">{applications.length}</div>
                  <p className="text-xs text-gray-600">Received</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
                  <CardTitle className="text-xs sm:text-sm font-medium">Total Projects</CardTitle>
                  <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  <div className="text-lg sm:text-2xl font-bold">{dashboardStats?.totalProjects || 0}</div>
                  <p className="text-xs text-gray-600">All projects</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
                  <CardTitle className="text-xs sm:text-sm font-medium">Assigned</CardTitle>
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  <div className="text-lg sm:text-2xl font-bold">{dashboardStats?.freelancersHired || 0}</div>
                  <p className="text-xs text-gray-600">In progress</p>
                </CardContent>
              </Card>
            </div>

            {/* Mobile-Responsive Quick Actions */}
            <Card className="bg-white border-gray-200">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
                <CardDescription className="text-sm sm:text-base">Get started with common tasks</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <Button 
                    onClick={handlePostNewJob}
                    className="h-auto p-4 sm:p-6 bg-blue-600 hover:bg-blue-700 flex-col space-y-2"
                  >
                    <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-sm sm:text-base">Post New Job</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleBrowseFreelancers}
                    className="h-auto p-4 sm:p-6 flex-col space-y-2 border-gray-200"
                  >
                    <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-sm sm:text-base">Browse Freelancers</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 sm:p-6 flex-col space-y-2 border-gray-200 sm:col-span-2 lg:col-span-1"
                  >
                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-sm sm:text-base">Messages</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white border-gray-200">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-3 sm:space-y-4">
                  {applications.slice(0, 3).map(application => (
                    <div key={application.id} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <span className="text-sm text-gray-600 block">
                          New application received for "{application.project.title}"
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(application.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {projects.slice(0, 2).map(project => (
                    <div key={`posted-${project.id}`} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <span className="text-sm text-gray-600 block">
                          Job "{project.title}" was posted
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {applications.length === 0 && projects.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">No recent activity to show</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4 sm:space-y-6">
            {/* Mobile-Responsive Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-1">
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-500 h-10"
                  />
                </div>
                <Button variant="outline" className="border-gray-200 h-10">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
              <Button onClick={handlePostNewJob} className="bg-blue-600 hover:bg-blue-700 h-10">
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Post New Job</span>
                <span className="sm:hidden">Post Job</span>
              </Button>
            </div>

            {/* Loading State */}
            {isProjectsLoading && (
              <div className="text-center py-6 sm:py-8">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm sm:text-base text-gray-600 mt-2">Loading your projects...</p>
              </div>
            )}

            {/* Projects Grid */}
            {!isProjectsLoading && (
              <div className="grid gap-4 sm:gap-6">
                {filteredProjects.length === 0 ? (
                  <Card className="bg-white border-gray-200">
                    <CardContent className="p-6 sm:p-8 text-center">
                      <Briefcase className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Projects Found</h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-4">
                        {searchTerm ? 'No projects match your search criteria.' : 'You haven\'t posted any projects yet.'}
                      </p>
                      <Button onClick={handlePostNewJob} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Post Your First Job
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  filteredProjects.map((project) => (
                    <Card key={project.id} className="bg-white border-gray-200">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{project.title}</h3>
                            <p className="text-gray-600 mb-3 text-sm sm:text-base line-clamp-3">{project.description}</p>
                          </div>
                          <Badge 
                            variant="default"
                            className={`${getStatusBadgeColor(project.status)} ml-2 shrink-0`}
                          >
                            {project.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          {/* Skills */}
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Skills Required:</p>
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                              {project.skillsRequired.slice(0, 5).map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {project.skillsRequired.length > 5 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{project.skillsRequired.length - 5} more
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {/* Budget and Duration */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex items-center text-lg font-semibold text-green-600">
                              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                              <span className="text-sm sm:text-base">{formatBudget(project.budgetMin, project.budgetMax)}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              Duration: {project.duration}
                            </div>
                          </div>

                          {/* Applications and Date */}
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-sm">
                            <span className="text-gray-600">
                              {project.applications?.length || 0} applications
                            </span>
                            <span className="text-xs text-gray-400">
                              Posted {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {/* Actions */}
                          {project.status === 'PENDING_COMPLETION' && (
                            <div className="flex justify-end pt-3 border-t border-gray-100">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-green-200 text-green-600 hover:bg-green-50"
                                onClick={() => handleApproveCompletion(project.id)}
                                disabled={isActionLoading === `approve-completion-${project.id}`}
                              >
                                {isActionLoading === `approve-completion-${project.id}` ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                                ) : (
                                  <Check className="w-4 h-4 mr-2" />
                                )}
                                Approve Completion
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="applicants" className="space-y-4 sm:space-y-6">
            {/* Mobile-Responsive Header */}
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Job Applicants</h2>
                <p className="text-sm text-gray-600 mt-1">{applications.length} total applications</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 sm:max-w-xs">
                  <Select value={selectedProjectFilter} onValueChange={setSelectedProjectFilter}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-500 h-10">
                      <SelectValue placeholder="Filter by project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      {getProjectsWithApplications().map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.title} ({project.applications?.length || 0})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search applicants..."
                      className="pl-10 border-gray-200 focus:border-blue-500 h-10"
                    />
                  </div>
                  <Button variant="outline" className="border-gray-200 h-10 px-3">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isApplicationsLoading && (
              <div className="text-center py-6 sm:py-8">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm sm:text-base text-gray-600 mt-2">Loading applications...</p>
              </div>
            )}

            {/* Applications Display */}
            {!isApplicationsLoading && (
              <div className="space-y-4 sm:space-y-6">
                {getFilteredProjects()
                  .filter(project => project.applications && project.applications.length > 0)
                  .map((project) => (
                    <div key={project.id} className="space-y-3 sm:space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-3 sm:pb-4 gap-2">
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900">{project.title}</h3>
                          <p className="text-sm text-gray-600">{project.applications.length} applications received</p>
                        </div>
                        <Badge variant="outline" className="text-xs self-start sm:self-center">
                          {project.status}
                        </Badge>
                      </div>
                      
                      <div className="grid gap-3 sm:gap-4">
                        {project.applications.map((application) => (
                          <Card key={application.id} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
                            <CardContent className="p-4 sm:p-6">
                              <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                                <Avatar className="w-12 h-12 sm:w-16 sm:h-16 ring-2 ring-blue-100 self-center sm:self-start">
                                  <AvatarImage src={application.freelancer?.user?.profileImage || "/placeholder.svg"} />
                                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm sm:text-base">
                                    {application.freelancer?.user?.name ? 
                                      application.freelancer.user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 
                                      'FL'
                                    }
                                  </AvatarFallback>
                                </Avatar>
                                
                                <div className="flex-1 space-y-3">
                                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                    <div className="space-y-2">
                                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                        <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                                          {application.freelancer?.user?.name || `Freelancer ${application.freelancerId.slice(-4)}`}
                                        </h4>
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 self-start sm:self-center"
                                          onClick={() => handleViewApplicantProfile(application)}
                                        >
                                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </Button>
                                      </div>
                                      
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                          <Mail className="w-3 h-3" />
                                          <span>{application.freelancer?.user?.email || 'Email not available'}</span>
                                        </div>
                                        
                                        {application.freelancer?.user?.location && (
                                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                            <MapPin className="w-3 h-3" />
                                            <span>{application.freelancer.user.location}</span>
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div className="flex flex-wrap items-center gap-2">
                                        <Badge 
                                          variant={application.status === 'PENDING' ? 'secondary' : 
                                                  application.status === 'ACCEPTED' ? 'default' : 'destructive'}
                                          className="text-xs"
                                        >
                                          {application.status}
                                        </Badge>
                                        
                                        {application.freelancer?.ratings && (
                                          <div className="flex items-center gap-1 text-xs sm:text-sm text-yellow-600">
                                            <Star className="w-3 h-3 fill-current" />
                                            <span>{application.freelancer.ratings}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    
                                    <div className="text-left sm:text-right space-y-1">
                                      <div className="text-xs sm:text-sm text-gray-500">
                                        Applied {new Date(application.createdAt).toLocaleDateString()}
                                      </div>
                                      <div className="text-xs text-gray-400">
                                        ID: {application.id.slice(-8)}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Proposal Preview */}
                                  <div>
                                    <h5 className="font-medium text-gray-900 text-sm mb-1">Proposal:</h5>
                                    <p className="text-gray-600 text-sm line-clamp-2">
                                      {application.proposal || "No proposal provided."}
                                    </p>
                                  </div>
                                  
                                  {/* Action Buttons */}
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 border-t border-gray-100 gap-3 sm:gap-0">
                                    <div className="flex flex-col sm:flex-row gap-2">
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => handleOpenApplicantModal(application)}
                                        className="border-blue-200 text-blue-600 hover:bg-blue-50 text-xs"
                                      >
                                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                        View Details
                                      </Button>
                                      
                                      <Button variant="outline" size="sm" className="border-gray-200 text-xs">
                                        <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                        Message
                                      </Button>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                      {application.status === 'PENDING' && (
                                        <>
                                          <Button 
                                            variant="outline" 
                                            size="sm"
                                            className="border-green-200 text-green-600 hover:bg-green-50 text-xs"
                                            onClick={() => handleApproveApplication(project.id, application.id)}
                                            disabled={isActionLoading === `approve-${application.id}`}
                                          >
                                            {isActionLoading === `approve-${application.id}` ? (
                                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600 mr-1"></div>
                                            ) : (
                                              <Check className="w-3 h-3 mr-1" />
                                            )}
                                            Accept
                                          </Button>
                                          <Button 
                                            variant="outline" 
                                            size="sm"
                                            className="border-red-200 text-red-600 hover:bg-red-50 text-xs"
                                            onClick={() => handleRejectApplication(project.id, application.id)}
                                            disabled={isActionLoading === `reject-${application.id}`}
                                          >
                                            {isActionLoading === `reject-${application.id}` ? (
                                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-1"></div>
                                            ) : (
                                              <X className="w-3 h-3 mr-1" />
                                            )}
                                            Reject
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                
                {/* No Applications State */}
                {getFilteredProjects().every(project => !project.applications || project.applications.length === 0) && (
                  <div className="text-center py-8 sm:py-12">
                    <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                      {selectedProjectFilter === 'all' ? 'No Applications Yet' : 'No Applications for Selected Project'}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-md mx-auto">
                      {selectedProjectFilter === 'all' 
                        ? "You haven't received any applications for your projects yet."
                        : "This project hasn't received any applications yet."
                      }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button onClick={handlePostNewJob} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Post a New Job
                      </Button>
                      {selectedProjectFilter !== 'all' && (
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedProjectFilter('all')}
                          className="border-gray-200"
                        >
                          View All Applications
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Applicant Details Modal */}
      <Dialog open={isApplicantModalOpen} onOpenChange={handleCloseApplicantModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Freelancer Profile & Application Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedApplicant && (
            <div className="space-y-6">
              {/* Freelancer Header */}
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <Avatar className="w-16 h-16 sm:w-24 sm:h-24 ring-4 ring-white shadow-lg">
                  <AvatarImage src={selectedApplicant.freelancer.user.profileImage || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg sm:text-xl">
                    {selectedApplicant.freelancer.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                        {selectedApplicant.freelancer.user.name}
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base">{selectedApplicant.freelancer.user.bio}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedApplicant.freelancer.isVerified && (
                        <Badge variant="default" className="bg-green-600">
                          <Check className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <Badge 
                        variant={selectedApplicant.status === 'PENDING' ? 'secondary' : 
                                selectedApplicant.status === 'ACCEPTED' ? 'default' : 'destructive'}
                      >
                        {selectedApplicant.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-600 truncate">{selectedApplicant.freelancer.user.email}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-600">{selectedApplicant.freelancer.user.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-gray-600">{selectedApplicant.freelancer.ratings} rating</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-gray-600">₹{selectedApplicant.freelancer.hourlyRate}/hr</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewApplicantProfile(selectedApplicant)}
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View Full Profile
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-200">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Experience & Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      Experience & Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Experience</span>
                        <p className="font-semibold">{selectedApplicant.freelancer.experience} years</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Age</span>
                        <p className="font-semibold">{selectedApplicant.freelancer.age} years</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Projects Completed</span>
                        <p className="font-semibold">{selectedApplicant.freelancer.projectsCompleted}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Availability</span>
                        <Badge variant={selectedApplicant.freelancer.availability ? "default" : "secondary"} className="text-xs">
                          {selectedApplicant.freelancer.availability ? "Available" : "Busy"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Project Applied For */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                      Applied For
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{selectedApplicant.project.title}</h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{selectedApplicant.project.description}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                      <div className="flex items-center text-green-600">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span>₹{selectedApplicant.project.budgetMin} - ₹{selectedApplicant.project.budgetMax}</span>
                      </div>
                      <Badge variant="outline" className="self-start">{selectedApplicant.project.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplicant.freelancer.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Proposal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    Proposal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gray-50 rounded-lg max-h-32 overflow-y-auto">
                    <p className="text-gray-700 whitespace-pre-wrap text-sm">
                      {selectedApplicant.proposal || "No proposal provided."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
                {selectedApplicant.status === 'PENDING' && (
                  <>
                    <Button 
                      variant="outline" 
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => {
                        handleRejectApplication(selectedApplicant.projectId, selectedApplicant.id);
                        handleCloseApplicantModal();
                      }}
                      disabled={isActionLoading === `reject-${selectedApplicant.id}`}
                    >
                      {isActionLoading === `reject-${selectedApplicant.id}` ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                      ) : (
                        <X className="w-4 h-4 mr-2" />
                      )}
                      Reject Application
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        handleApproveApplication(selectedApplicant.projectId, selectedApplicant.id);
                        handleCloseApplicantModal();
                      }}
                      disabled={isActionLoading === `approve-${selectedApplicant.id}`}
                    >
                      {isActionLoading === `approve-${selectedApplicant.id}` ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Check className="w-4 h-4 mr-2" />
                      )}
                      Accept Application
                    </Button>
                  </>
                )}
                
                {selectedApplicant.status !== 'PENDING' && (
                  <Button variant="outline" onClick={handleCloseApplicantModal}>
                    Close
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rating Modal */}
      <RatingModal
        isOpen={ratingModal.isOpen}
        onClose={() => setRatingModal({ isOpen: false, projectId: "", projectTitle: "" })}
        onSubmit={handleRateFreelancer}
        isSubmitting={isActionLoading === `rating-${ratingModal.projectId}`}
        projectTitle={ratingModal.projectTitle}
      />
    </div>
  );
};

export default ClientDashboard;
