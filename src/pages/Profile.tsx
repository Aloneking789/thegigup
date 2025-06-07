
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Briefcase,
  Settings,
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Camera,
  Star,
  Calendar,
  Award,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { clientService, freelancerService } from "@/lib/api/client";
import { FreelancerProfileResponse, ClientProfileResponse } from "@/lib/api/types";

const Profile = () => {
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<'FREELANCER' | 'CLIENT' | null>(null);
  const [profileData, setProfileData] = useState<FreelancerProfileResponse | ClientProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get role from localStorage
        const role = localStorage.getItem('role') as 'FREELANCER' | 'CLIENT' | null;
        
        if (!role) {
          throw new Error('No user role found. Please log in again.');
        }
        
        setUserRole(role);
        
        // Fetch profile data based on role
        let response;
        if (role === 'FREELANCER') {
          response = await freelancerService.getProfile();
        } else if (role === 'CLIENT') {
          response = await clientService.getProfile();
        }
        
        if (response?.success) {
          setProfileData(response.data);
        } else {
          throw new Error('Failed to fetch profile data');
        }
        
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [toast]);

  // Format time since joined
  const formatMemberSince = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Profile</h2>
          <p className="text-gray-600 mb-4">{error || 'Unknown error occurred'}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Check if it's freelancer profile
  const isFreelancer = userRole === 'FREELANCER';
  const freelancerData = isFreelancer ? (profileData as FreelancerProfileResponse).freelancer : null;

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
            </div>            <nav className="hidden md:flex items-center space-x-6">
              {isFreelancer ? (
                <>
                  <Link to="/find-work" className="text-gray-600 hover:text-blue-600">Find Work</Link>
                  <Link to="/freelancer-dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
                </>
              ) : (
                <>
                  <Link to="/find-talent" className="text-gray-600 hover:text-blue-600">Find Talent</Link>
                  <Link to="/client-dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
                  <Link to="/post-job" className="text-gray-600 hover:text-blue-600">Post Job</Link>
                </>
              )}
              <Link to="/about" className="text-gray-600 hover:text-blue-600">About</Link>
              <Link to="/profile" className="text-blue-600 font-medium">Profile</Link>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="bg-white border-gray-200 mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={profileData.profileImage || undefined} />
                  <AvatarFallback className="text-2xl">
                    {profileData.name?.split(" ").map(n => n[0]).join("") || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0">
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{profileData.name || 'User'}</h1>
                  <p className="text-xl text-blue-600 font-medium">
                    {isFreelancer 
                      ? (freelancerData?.experience ? `${freelancerData.experience} Experience` : 'Experience not specified')
                      : 'Client'
                    }
                  </p>
                  {isFreelancer && freelancerData && (
                    <div className="flex items-center mt-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="ml-1 font-medium">{freelancerData.ratings || 0}</span>
                      <span className="text-gray-500 ml-1">({freelancerData.projectsCompleted} projects)</span>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {profileData.email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {/* Phone not in API response */}
                    Not specified
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {profileData.location || 'Location not specified'}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {isFreelancer ? 'Completed Projects' : 'Total Projects'}
                  </CardTitle>
                  <Briefcase className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isFreelancer ? (freelancerData?.projectsCompleted || 0) : 'N/A'}
                  </div>
                  <p className="text-xs text-gray-600">
                    {isFreelancer ? 'Successfully delivered' : 'Projects posted'}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {isFreelancer ? 'Hourly Rate' : 'Account Status'}
                  </CardTitle>
                  <Award className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isFreelancer 
                      ? (freelancerData?.hourlyRate ? `₹${freelancerData.hourlyRate}/hr` : 'Not set')
                      : (profileData.isActive ? 'Active' : 'Inactive')
                    }
                  </div>
                  <p className="text-xs text-gray-600">
                    {isFreelancer ? 'Current rate' : 'Account status'}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                  <Calendar className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatMemberSince(profileData.createdAt)}
                  </div>
                  <p className="text-xs text-gray-600">Join date</p>
                </CardContent>
              </Card>
            </div>            {/* Bio and Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    {profileData.bio || 'No bio provided yet.'}
                  </p>
                </CardContent>
              </Card>

              {isFreelancer && (
                <Card className="bg-white border-gray-200">
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {freelancerData?.skills && freelancerData.skills.length > 0 ? (
                        freelancerData.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No skills added yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {!isFreelancer && (
                <Card className="bg-white border-gray-200">
                  <CardHeader>
                    <CardTitle>Portfolio Links</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {isFreelancer && freelancerData ? (
                        <>
                          {freelancerData.githubUrl && (
                            <div className="flex items-center text-sm">
                              <span className="w-16 text-gray-500">GitHub:</span>
                              <a href={freelancerData.githubUrl} target="_blank" rel="noopener noreferrer" 
                                 className="text-blue-600 hover:underline">
                                {freelancerData.githubUrl}
                              </a>
                            </div>
                          )}
                          {freelancerData.linkedinUrl && (
                            <div className="flex items-center text-sm">
                              <span className="w-16 text-gray-500">LinkedIn:</span>
                              <a href={freelancerData.linkedinUrl} target="_blank" rel="noopener noreferrer" 
                                 className="text-blue-600 hover:underline">
                                {freelancerData.linkedinUrl}
                              </a>
                            </div>
                          )}
                          {freelancerData.portfolioUrl && (
                            <div className="flex items-center text-sm">
                              <span className="w-16 text-gray-500">Portfolio:</span>
                              <a href={freelancerData.portfolioUrl} target="_blank" rel="noopener noreferrer" 
                                 className="text-blue-600 hover:underline">
                                {freelancerData.portfolioUrl}
                              </a>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-500 text-sm">No portfolio links available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="portfolio">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle>Portfolio Projects</CardTitle>
                <CardDescription>Showcase your best work</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Portfolio Items Yet</h3>
                  <p className="text-gray-600 mb-6">Add your best work to showcase your skills</p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Add Portfolio Item
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle>Client Reviews</CardTitle>
                <CardDescription>What clients say about your work</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-600">Complete your first project to start receiving reviews</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <User className="w-4 h-4 mr-2" />
                    Edit Personal Information
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Preferences
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Notification Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
