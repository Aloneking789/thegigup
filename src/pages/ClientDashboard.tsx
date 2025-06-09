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

const ClientDashboard = () => {  const [activeTab, setActiveTab] = useState("overview");
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
      });    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setIsApplicationsLoading(true);
      console.log('Fetching applications...');
      const response = await clientService.getApplications(1, 50); // Fetch more applications
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
      
      // For development/demo purposes, set empty array to show empty state
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

  const handleViewMessages = () => {
    // For now, just show an alert - in a real app this would navigate to messages
    alert("Messages functionality would be implemented here");
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
  const handleRefreshProjects = () => {
    fetchProjects();
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
        // Refresh data to show updated status
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
        // Refresh data to show updated status
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

  // Project Completion Management
  const handleApproveCompletion = async (projectId: string) => {
    try {
      setIsActionLoading(`approve-completion-${projectId}`);
      const response = await clientService.approveCompletion(projectId);
      
      if (response.success) {
        toast({
          title: "Completion Approved",
          description: "Project completion has been approved. You can now rate the freelancer.",
        });
        // Refresh data and potentially open rating modal
        await fetchDashboardData();
        
        // Find the project to get its title for rating
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
    // Create profile URL using the freelancer's user data
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
    // Get unique projects from applications
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

  // Reject completion handler
  const handleRejectCompletion = async (projectId: string) => {
    try {
      setIsActionLoading(`reject-completion-${projectId}`);
      const response = await clientService.rejectCompletion(projectId);
      
      if (response.success) {
        toast({
          title: "Completion Rejected",
          description: "Project completion has been rejected. The freelancer will be notified.",
        });
        await fetchDashboardData();
      }
    } catch (error) {
      console.error('Failed to reject completion:', error);
      toast({
        title: "Error",
        description: "Failed to reject completion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(null);
    }
  };

  // Rating handler
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
    }  };

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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <Link to="/" className="text-xl font-bold text-gray-900">FreelanceHub</Link>
            </div>            <div className="flex items-center space-x-4">
              {/* <Button variant="outline" onClick={handleViewMessages}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Messages
              </Button> */}
 
              {isLoggedIn() && (
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              )}
              <Avatar className="cursor-pointer" onClick={handleProfileClick}>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>        </div>
      </header>

      <MobileNav 
        userLoggedIn={true}
        userRole="CLIENT"
        userProfile={{
          name: 'Client User',
          email: '',
          profileImage: undefined
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Dashboard</h1>
          <p className="text-gray-600">Manage your projects and find the perfect talent</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">My Jobs</TabsTrigger>
            <TabsTrigger value="applicants">Applicants</TabsTrigger>
            {/* <TabsTrigger value="contracts">Contracts</TabsTrigger> */}
          </TabsList>          <TabsContent value="overview" className="space-y-6">            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                  <Briefcase className="h-4 w-4 text-blue-600" />
                </CardHeader>                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats?.activeProjects || 0}</div>
                  <p className="text-xs text-gray-600">Currently open positions</p>
                </CardContent>
              </Card>              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                  <Users className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {applications.length}
                  </div>
                  <p className="text-xs text-gray-600">Applications received</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                  <DollarSign className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats?.totalProjects || 0}</div>
                  <p className="text-xs text-gray-600">All projects posted</p>
                </CardContent>
              </Card>              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Assigned Projects</CardTitle>
                  <Star className="h-4 w-4 text-purple-600" />
                </CardHeader>                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats?.freelancersHired || 0}</div>
                  <p className="text-xs text-gray-600">Projects in progress</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Get started with common tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={handlePostNewJob}
                    className="h-auto p-6 bg-blue-600 hover:bg-blue-700 flex-col space-y-2"
                  >
                    <Plus className="w-6 h-6" />
                    <span>Post New Job</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleBrowseFreelancers}
                    className="h-auto p-6 flex-col space-y-2 border-gray-200"
                  >
                    <Search className="w-6 h-6" />
                    <span>Browse Freelancers</span>
                  </Button>
                  {/* <Button 
                    variant="outline" 
                    onClick={handleViewMessages}
                    className="h-auto p-6 flex-col space-y-2 border-gray-200"
                  >
                    <MessageSquare className="w-6 h-6" />
                    <span>View Messages</span>
                  </Button> */}
                </div>
              </CardContent>
            </Card>            {/* Recent Activity */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>                <div className="space-y-4">
                  {/* Show recent applications */}
                  {applications
                    .slice(0, 3)
                    .map(application => (
                      <div key={application.id} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">
                          New application received for "{application.project.title}"
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(application.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  
                  {/* Show recent job postings */}
                  {projects
                    .slice(0, 2)
                    .map(project => (
                      <div key={`posted-${project.id}`} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">
                          Job "{project.title}" was posted
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                    {/* Fallback if no activity */}
                  {applications.length === 0 && projects.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">No recent activity to show</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80 border-gray-200 focus:border-blue-500"
                  />
                </div>
                <Button variant="outline" className="border-gray-200">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
              <Button onClick={handlePostNewJob} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Post New Job
              </Button>
            </div>            {/* Loading State for Projects */}
            {isProjectsLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading your projects...</p>
              </div>
            )}

            {/* Projects Grid */}
            {!isProjectsLoading && (
              <div className="grid gap-6">
                {filteredProjects.length === 0 ? (
                  <Card className="bg-white border-gray-200">
                    <CardContent className="p-8 text-center">
                      <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Projects Found</h3>
                      <p className="text-gray-600 mb-4">
                        {searchTerm ? 'No projects match your search criteria.' : 'You haven\'t posted any projects yet.'}
                      </p>
                      <Button onClick={handlePostNewJob} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Post Your First Job
                      </Button>
                    </CardContent>
                  </Card>                ) : (
                  filteredProjects.map((project) => (
                    <Card key={project.id} className="bg-white border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                            <p className="text-gray-600 mb-3 line-clamp-3">{project.description}</p>
                          </div>
                          <Badge 
                            variant="default"
                            className={getStatusBadgeColor(project.status)}
                          >
                            {project.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          {/* Skills Required */}
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Skills Required:</p>
                            <div className="flex flex-wrap gap-2">
                              {project.skillsRequired.map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          {/* Budget */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-lg font-semibold text-green-600">
                              <DollarSign className="w-5 h-5 mr-1" />
                              <span>{formatBudget(project.budgetMin, project.budgetMax)}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              Duration: {project.duration}
                            </div>
                          </div>
                            {/* Applications count */}
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <span className="text-sm text-gray-600">
                              {project.applications?.length || 0} applications received
                            </span>
                            <span className="text-xs text-gray-400">
                              Posted {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          {/* Project Actions based on status */}
                          {project.status === 'PENDING_COMPLETION' && (
                            <div className="flex items-center justify-end pt-3 border-t border-gray-100">
                              <Button 
                                variant="outline" 
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
                          
                          {project.status === 'COMPLETED' && (
                            <div className="flex items-center justify-end pt-3 border-t border-gray-100">
                              <Button 
                                variant="outline" 
                                className="border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                                onClick={() => setRatingModal({
                                  isOpen: true,
                                  projectId: project.id,
                                  projectTitle: project.title
                                })}
                              >
                                <Award className="w-4 h-4 mr-2" />
                                Rate Freelancer
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>            )}
          </TabsContent>          <TabsContent value="applicants" className="space-y-6">
            {/* Enhanced Header with Project Filter */}            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Job Applicants</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {applications.length} total applications
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                {/* Project Filter Dropdown */}
                <div className="min-w-[200px]">
                  <Select value={selectedProjectFilter} onValueChange={setSelectedProjectFilter}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-500">
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
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search applicants..."
                      className="pl-10 w-64 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  <Button variant="outline" className="border-gray-200">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </div>            {/* Loading State */}
            {isApplicationsLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading applications...</p>
              </div>
            )}            {/* Enhanced Applications Display */}
            {!isApplicationsLoading && (
              <div className="space-y-6">
                {getFilteredProjects()
                  .filter(project => project.applications && project.applications.length > 0)
                  .map((project) => (
                    <div key={project.id} className="space-y-4">
                      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                          <p className="text-sm text-gray-600">{project.applications.length} applications received</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {project.status}
                        </Badge>
                      </div>
                      
                      <div className="grid gap-4">
                        {project.applications.map((application) => (
                          <Card key={application.id} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                              <div className="flex items-start space-x-4">
                                <Avatar className="w-16 h-16 ring-2 ring-blue-100">
                                  <AvatarImage src={application.freelancer?.user?.profileImage || "/placeholder.svg"} />
                                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                    {application.freelancer?.user?.name ? 
                                      application.freelancer.user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 
                                      'FL'
                                    }
                                  </AvatarFallback>
                                </Avatar>
                                
                                <div className="flex-1 space-y-3">
                                  <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <h4 className="text-lg font-semibold text-gray-900">
                                          {application.freelancer?.user?.name || `Freelancer ${application.freelancerId.slice(-4)}`}
                                        </h4>
                                        {/* Public Profile Link */}
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                                          onClick={() => handleViewApplicantProfile(application)}
                                          title="View Public Profile"
                                        >
                                          <ExternalLink className="w-4 h-4" />
                                        </Button>
                                      </div>
                                      
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail className="w-3 h-3" />
                                        <span>{application.freelancer?.user?.email || 'Email not available'}</span>
                                      </div>
                                      
                                      {application.freelancer?.user?.location && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                          <MapPin className="w-3 h-3" />
                                          <span>{application.freelancer.user.location}</span>
                                        </div>
                                      )}
                                      
                                      <div className="flex items-center gap-2 mt-2">
                                        <Badge 
                                          variant={application.status === 'PENDING' ? 'secondary' : 
                                                  application.status === 'ACCEPTED' ? 'default' : 'destructive'}
                                        >
                                          {application.status}
                                        </Badge>
                                        
                                        {application.freelancer?.ratings && (
                                          <div className="flex items-center gap-1 text-sm text-yellow-600">
                                            <Star className="w-3 h-3 fill-current" />
                                            <span>{application.freelancer.ratings}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    
                                    <div className="text-right space-y-1">
                                      <div className="text-sm text-gray-500">
                                        Applied {new Date(application.createdAt).toLocaleDateString()}
                                      </div>
                                      <div className="text-xs text-gray-400">
                                        ID: {application.id.slice(-8)}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Proposal Preview */}
                                  <div className="space-y-2">
                                    <div>
                                      <h5 className="font-medium text-gray-900 text-sm">Proposal:</h5>
                                      <p className="text-gray-600 text-sm line-clamp-2">
                                        {application.proposal || "No proposal provided."}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {/* Action Buttons */}
                                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <div className="flex items-center space-x-2">
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => handleOpenApplicantModal(application)}
                                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                                      >
                                        <Eye className="w-4 h-4 mr-1" />
                                        View Details
                                      </Button>
                                      
                                      <Button variant="outline" size="sm" className="border-gray-200">
                                        <MessageSquare className="w-4 h-4 mr-1" />
                                        Message
                                      </Button>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                      {application.status === 'PENDING' && (
                                        <>
                                          <Button 
                                            variant="outline" 
                                            size="sm"
                                            className="border-green-200 text-green-600 hover:bg-green-50"
                                            onClick={() => handleApproveApplication(application.projectId, application.id)}
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
                                            className="border-red-200 text-red-600 hover:bg-red-50"
                                            onClick={() => handleRejectApplication(application.projectId, application.id)}
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
                                      
                                      {application.status === 'ACCEPTED' && application.project.status === 'IN_PROGRESS' && (
                                        <>
                                          <Button 
                                            variant="outline" 
                                            size="sm"
                                            className="border-green-200 text-green-600 hover:bg-green-50"
                                            onClick={() => handleApproveCompletion(application.projectId)}
                                            disabled={isActionLoading === `approve-completion-${application.projectId}`}
                                          >
                                            {isActionLoading === `approve-completion-${application.projectId}` ? (
                                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600 mr-1"></div>
                                            ) : (
                                              <Check className="w-3 h-3 mr-1" />
                                            )}
                                            Approve Completion
                                          </Button>
                                          <Button 
                                            variant="outline" 
                                            size="sm"
                                            className="border-red-200 text-red-600 hover:bg-red-50"
                                            onClick={() => handleRejectCompletion(application.projectId)}
                                            disabled={isActionLoading === `reject-completion-${application.projectId}`}
                                          >
                                            {isActionLoading === `reject-completion-${application.projectId}` ? (
                                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-1"></div>
                                            ) : (
                                              <X className="w-3 h-3 mr-1" />
                                            )}
                                            Reject Completion
                                          </Button>
                                        </>
                                      )}
                                      
                                      {application.project.status === 'COMPLETED' && (
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          className="border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                                          onClick={() => setRatingModal({
                                            isOpen: true,
                                            projectId: application.projectId,
                                            projectTitle: application.project.title
                                          })}
                                        >
                                          <Award className="w-3 h-3 mr-1" />
                                          Rate
                                        </Button>
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
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {selectedProjectFilter === 'all' ? 'No Applications Yet' : 'No Applications for Selected Project'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {selectedProjectFilter === 'all' 
                        ? "You haven't received any applications for your projects yet. Make sure your job posts are attractive to freelancers."
                        : "This project hasn't received any applications yet. Consider promoting it or adjusting the requirements."
                      }
                    </p>
                    <div className="flex gap-3 justify-center">
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

          <TabsContent value="contracts" className="space-y-6">
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Contracts</h3>
              <p className="text-gray-600 mb-6">You don't have any active contracts at the moment.</p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Post Your First Job
              </Button>
            </div>          </TabsContent>
        </Tabs>      </div>      {/* Applicant Details Modal */}
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
              <div className="flex items-start gap-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <Avatar className="w-24 h-24 ring-4 ring-white shadow-lg">
                  <AvatarImage src={selectedApplicant.freelancer.user.profileImage || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl">
                    {selectedApplicant.freelancer.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {selectedApplicant.freelancer.user.name}
                      </h3>
                      <p className="text-gray-600">{selectedApplicant.freelancer.user.bio}</p>
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
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-600">{selectedApplicant.freelancer.user.email}</span>
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
                  
                  <div className="flex gap-2 pt-2">
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

              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column - Freelancer Details */}
                <div className="space-y-6">
                  {/* Experience & Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Briefcase className="w-5 h-5 text-blue-600" />
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
                          <p className="font-semibold">
                            <Badge variant={selectedApplicant.freelancer.availability ? "default" : "secondary"}>
                              {selectedApplicant.freelancer.availability ? "Available" : "Busy"}
                            </Badge>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Skills */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Award className="w-5 h-5 text-purple-600" />
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

                  {/* Links */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <ExternalLink className="w-5 h-5 text-green-600" />
                        Portfolio & Links
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedApplicant.freelancer.portfolioUrl && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 w-20">Portfolio:</span>
                          <a 
                            href={selectedApplicant.freelancer.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            View Portfolio <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                      {selectedApplicant.freelancer.githubUrl && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 w-20">GitHub:</span>
                          <a 
                            href={selectedApplicant.freelancer.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            View GitHub <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                      {selectedApplicant.freelancer.linkedinUrl && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 w-20">LinkedIn:</span>
                          <a 
                            href={selectedApplicant.freelancer.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            View LinkedIn <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Application Details */}
                <div className="space-y-6">
                  {/* Project Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Briefcase className="w-5 h-5 text-orange-600" />
                        Applied For
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{selectedApplicant.project.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{selectedApplicant.project.description}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center text-green-600">
                          <DollarSign className="w-4 h-4 mr-1" />
                          <span>₹{selectedApplicant.project.budgetMin} - ₹{selectedApplicant.project.budgetMax}</span>
                        </div>
                        <Badge variant="outline">{selectedApplicant.project.status}</Badge>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Required Skills:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedApplicant.project.skillsRequired.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Application Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        Application Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Applied on:</span>
                          <p className="font-medium">{new Date(selectedApplicant.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Application ID:</span>
                          <p className="font-medium text-xs">{selectedApplicant.id.slice(-8)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Proposal */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <MessageSquare className="w-5 h-5 text-green-600" />
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

                  {/* Cover Letter */}
                  {selectedApplicant.coverLetter && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Mail className="w-5 h-5 text-purple-600" />
                          Cover Letter
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="p-4 bg-gray-50 rounded-lg max-h-32 overflow-y-auto">
                          <p className="text-gray-700 whitespace-pre-wrap text-sm">
                            {selectedApplicant.coverLetter}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
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
