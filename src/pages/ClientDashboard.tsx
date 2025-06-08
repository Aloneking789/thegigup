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
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { isLoggedIn, logout, RoleStorage } from "@/lib/config/api";
import { clientService } from "@/lib/api/client";
import { 
  ClientProject, 
  ClientDashboardStats, 
  ClientDashboardResponse 
} from "@/lib/api/types";
import RatingModal from "@/components/RatingModal";

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [dashboardStats, setDashboardStats] = useState<ClientDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProjectsLoading, setIsProjectsLoading] = useState(false);
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
  }, [navigate]);  const fetchDashboardData = async () => {
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
      setProjects([]);      setDashboardStats({
        totalProjects: 0,
        openProjects: 0,
        assignedProjects: 0,
        completedProjects: 0,
        pendingApplications: 0
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

  const handleRejectCompletion = async (projectId: string) => {
    try {
      setIsActionLoading(`reject-completion-${projectId}`);
      const response = await clientService.rejectCompletion(projectId);
      
      if (response.success) {
        toast({
          title: "Completion Rejected",
          description: "Project completion has been rejected. The freelancer has been notified.",
        });
        // Refresh data to show updated status
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

  // Freelancer Rating
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
        // Refresh data
        await fetchDashboardData();
      }
    } catch (error) {
      console.error('Failed to rate freelancer:', error);
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
          </div>
        </div>
      </header>

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
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats?.openProjects || 0}</div>
                  <p className="text-xs text-gray-600">Currently open positions</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                  <Users className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {projects.reduce((total, project) => total + (project.applications?.length || 0), 0)}
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
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats?.assignedProjects || 0}</div>
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
              <CardContent>
                <div className="space-y-4">
                  {/* Show recent applications */}
                  {projects
                    .filter(project => project.applications && project.applications.length > 0)
                    .slice(0, 3)
                    .map(project => (
                      <div key={project.id} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">
                          New application received for "{project.title}"
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(project.applications[0].createdAt).toLocaleDateString()}
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
                  {projects.length === 0 && (
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
          </TabsContent>

          <TabsContent value="applicants" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Job Applicants</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search applicants..."
                    className="pl-10 w-80 border-gray-200 focus:border-blue-500"
                  />
                </div>
                <Button variant="outline" className="border-gray-200">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {isProjectsLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading applications...</p>
              </div>
            )}

            {/* Applications Display */}
            {!isProjectsLoading && (
              <div className="space-y-6">
                {projects.map((project) => (
                  project.applications && project.applications.length > 0 && (
                    <div key={project.id} className="space-y-4">
                      <div className="border-b border-gray-200 pb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                        <p className="text-sm text-gray-600">{project.applications.length} applications</p>
                      </div>
                      
                      <div className="grid gap-4">
                        {project.applications.map((application) => (
                          <Card key={application.id} className="bg-white border-gray-200">
                            <CardContent className="p-6">
                              <div className="flex items-start space-x-4">
                                <Avatar className="w-16 h-16">
                                  <AvatarImage src="/placeholder.svg" />
                                  <AvatarFallback>
                                    FL
                                  </AvatarFallback>
                                </Avatar>
                                
                                <div className="flex-1 space-y-3">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="text-lg font-semibold text-gray-900">
                                        Freelancer {application.freelancerId.slice(-4)}
                                      </h4>
                                      <p className="text-blue-600 font-medium">
                                        Freelancer
                                      </p>
                                      <Badge 
                                        variant={application.status === 'PENDING' ? 'secondary' : 
                                                application.status === 'ACCEPTED' ? 'default' : 'destructive'}
                                        className="mt-1"
                                      >
                                        {application.status}
                                      </Badge>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-sm text-gray-500">
                                        Application ID: {application.id.slice(-8)}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div>
                                      <h5 className="font-medium text-gray-900">Proposal:</h5>
                                      <p className="text-gray-600 text-sm">
                                        {application.proposal || "No proposal provided."}
                                      </p>
                                    </div>
                                    
                                    {application.coverLetter && (
                                      <div>
                                        <h5 className="font-medium text-gray-900">Cover Letter:</h5>
                                        <p className="text-gray-600 text-sm line-clamp-2">
                                          {application.coverLetter}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-500">
                                      Applied {new Date(application.createdAt).toLocaleDateString()}
                                    </div>
                                      <div className="flex items-center space-x-3">
                                      <Button variant="outline" className="border-gray-200">
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Message
                                      </Button>
                                      {application.status === 'PENDING' && (
                                        <>
                                          <Button 
                                            variant="outline" 
                                            className="border-green-200 text-green-600 hover:bg-green-50"
                                            onClick={() => handleApproveApplication(project.id, application.id)}
                                            disabled={isActionLoading === `approve-${application.id}`}
                                          >
                                            {isActionLoading === `approve-${application.id}` ? (
                                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                                            ) : (
                                              <Check className="w-4 h-4 mr-2" />
                                            )}
                                            Accept
                                          </Button>
                                          <Button 
                                            variant="outline" 
                                            className="border-red-200 text-red-600 hover:bg-red-50"
                                            onClick={() => handleRejectApplication(project.id, application.id)}
                                            disabled={isActionLoading === `reject-${application.id}`}
                                          >
                                            {isActionLoading === `reject-${application.id}` ? (
                                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                                            ) : (
                                              <X className="w-4 h-4 mr-2" />
                                            )}
                                            Reject
                                          </Button>
                                        </>
                                      )}
                                      {application.status === 'ACCEPTED' && project.status === 'IN_PROGRESS' && (
                                        <>
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
                                          <Button 
                                            variant="outline" 
                                            className="border-red-200 text-red-600 hover:bg-red-50"
                                            onClick={() => handleRejectCompletion(project.id)}
                                            disabled={isActionLoading === `reject-completion-${project.id}`}
                                          >
                                            {isActionLoading === `reject-completion-${project.id}` ? (
                                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                                            ) : (
                                              <X className="w-4 h-4 mr-2" />
                                            )}
                                            Reject Completion
                                          </Button>
                                        </>
                                      )}
                                      {project.status === 'COMPLETED' && (
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
                  )
                ))}
                
                {/* No Applications State */}
                {projects.every(project => !project.applications || project.applications.length === 0) && (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
                    <p className="text-gray-600 mb-6">
                      You haven't received any applications for your projects yet. Make sure your job posts are attractive to freelancers.
                    </p>
                    <Button onClick={handlePostNewJob} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Post a New Job
                    </Button>
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
        </Tabs>
      </div>

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
