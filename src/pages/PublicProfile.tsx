
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { logout, getApiUrl, isLoggedIn } from "@/lib/config/api";
import { FreelancerProfileResponse, ClientProfileResponse } from "@/lib/api/types";

const PublicProfile = () => {
  const { userId, nameSlug } = useParams<{ userId: string; nameSlug: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<'FREELANCER' | 'CLIENT' | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const loadPublicProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!userId) {
          throw new Error('User ID not provided in URL');
        }

        // Check if user is logged in
        setIsLoggedInUser(isLoggedIn());
          // Try first API endpoint - general user profile
        let response;
        let data;
        let apiUsed = 'users';

        try {
          response = await fetch(getApiUrl(`/public/users/${userId}/profile`), {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            data = await response.json();
            console.log('Profile data from users API:', data);
            
            if (data.success) {
              setProfileData(data.data);
              
              // Determine if this is a freelancer or client based on the userType in response
              if (data.data.userType === 'FREELANCER') {
                setUserRole('FREELANCER');
              } else if (data.data.userType === 'CLIENT') {
                setUserRole('CLIENT');
              } else {
                throw new Error('Unable to determine user type');
              }
              return; // Success, exit early
            } else {
              throw new Error(data.message || 'Failed to fetch profile data from users API');
            }
          } else {
            throw new Error(`Users API failed: ${response.statusText}`);
          }
        } catch (error) {
          console.log('Users API failed, trying freelancers API:', error);
          
          // Fallback to freelancers API
          try {
            response = await fetch(getApiUrl(`/public/freelancers/${userId}/profile`), {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (!response.ok) {
              throw new Error(`Freelancers API failed: ${response.statusText}`);
            }

            data = await response.json();
            apiUsed = 'freelancers';
            console.log('Profile data from freelancers API:', data);
            
            if (data.success) {
              // Transform freelancers API response to match users API format
              const transformedData = {
                userType: 'FREELANCER',
                freelancer: data.data.freelancer,
                ratingsReceived: data.data.ratingsReceived,
                completedProjects: data.data.completedProjects
              };
              
              setProfileData(transformedData);
              setUserRole('FREELANCER');
            } else {
              throw new Error(data.message || 'Failed to fetch profile data from freelancers API');
            }
          } catch (freelancerError) {
            console.error('Both APIs failed:', freelancerError);
            throw new Error('Unable to load profile from any available endpoint');
          }
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

    loadPublicProfile();
  }, [userId, toast]);

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
  }  // Check if it's freelancer profile
  const isFreelancer = userRole === 'FREELANCER';
  const freelancerData = isFreelancer ? profileData.freelancer : null;
  const clientData = !isFreelancer ? profileData.client : null;
  
  // Get common profile data
  const displayName = isFreelancer 
    ? freelancerData?.profile?.name || 'Unknown User'
    : clientData?.profile?.name || 'Unknown User';
  const displayEmail = profileData.email || 'Email not available';
  const displayLocation = isFreelancer 
    ? freelancerData?.profile?.location || 'Location not specified'
    : clientData?.profile?.location || 'Location not specified';
  const profileImage = isFreelancer 
    ? freelancerData?.profile?.profileImage
    : clientData?.profile?.profileImage;
  const memberSince = isFreelancer 
    ? freelancerData?.profile?.memberSince
    : clientData?.profile?.memberSince;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <Link to="/" className="text-xl font-bold text-gray-900">FreelanceHub</Link>
              </div>
            </div>

            {isLoggedInUser && (
              <nav className="hidden md:flex items-center space-x-6">
                <Link to="/about" className="text-gray-600 hover:text-blue-600">About</Link>
                <Link to="/profile" className="text-gray-600 hover:text-blue-600">My Profile</Link>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  Logout
                </Button>
              </nav>
            )}
            
            {!isLoggedInUser && (
              <nav className="hidden md:flex items-center space-x-6">
                <Link to="/about" className="text-gray-600 hover:text-blue-600">About</Link>
                <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Sign Up
                  </Button>
                </Link>
              </nav>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="bg-white border-gray-200 mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={profileImage || undefined} />
                  <AvatarFallback className="text-2xl">
                    {displayName.split(" ").map(n => n[0]).join("") || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1 space-y-4">                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{displayName}</h1>
                  <p className="text-xl text-blue-600 font-medium">
                    {isFreelancer 
                      ? (freelancerData?.professionalInfo?.experience ? `${freelancerData.professionalInfo.experience} years experience` : 'Experience not specified')
                      : (clientData?.companyInfo?.companyName || 'Client')
                    }
                  </p>
                  {isFreelancer && freelancerData && (
                    <div className="flex items-center mt-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="ml-1 font-medium">{freelancerData.statistics?.averageRating || 0}</span>
                      <span className="text-gray-500 ml-1">({freelancerData.statistics?.projectsCompleted || 0} projects)</span>
                      {freelancerData.professionalInfo?.isVerified && (
                        <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">
                          Verified
                        </Badge>
                      )}
                      <Badge 
                        className={`ml-2 ${freelancerData.professionalInfo?.availability 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}
                      >
                        {freelancerData.professionalInfo?.availability ? 'Available' : 'Busy'}
                      </Badge>
                    </div>
                  )}
                  {!isFreelancer && clientData && (
                    <div className="flex items-center mt-2">
                      <span className="text-gray-500">Industry: {clientData.companyInfo?.industry || 'Not specified'}</span>
                      {clientData.companyInfo?.isVerified && (
                        <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">
                          Verified
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {displayEmail}
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {isFreelancer ? 'Freelancer' : 'Client'}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {displayLocation}
                  </div>
                </div>

                {isLoggedInUser && (
                  <div className="flex gap-4">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact {isFreelancer ? 'Freelancer' : 'Client'}
                    </Button>
                    {isFreelancer && (
                      <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                        <Briefcase className="w-4 h-4 mr-2" />
                        Hire Now
                      </Button>
                    )}
                  </div>
                )}
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
              {/* Stats Cards */}              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {isFreelancer ? 'Completed Projects' : 'Total Projects'}
                  </CardTitle>
                  <Briefcase className="h-4 w-4 text-blue-600" />
                </CardHeader>                <CardContent>
                  <div className="text-2xl font-bold">
                    {isFreelancer 
                      ? (freelancerData?.statistics?.projectsCompleted || 0) 
                      : (clientData?.statistics?.projectsCompleted || 0)
                    }
                  </div>
                  <p className="text-xs text-gray-600">
                    {isFreelancer ? 'Successfully delivered' : 'Projects completed'}
                  </p>
                </CardContent>
              </Card>              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {isFreelancer ? 'Hourly Rate' : 'Rating'}
                  </CardTitle>
                  <Award className="h-4 w-4 text-green-600" />
                </CardHeader>                <CardContent>
                  <div className="text-2xl font-bold">
                    {isFreelancer 
                      ? (freelancerData?.professionalInfo?.hourlyRate ? `₹${freelancerData.professionalInfo.hourlyRate}/hr` : 'Not set')
                      : (clientData?.statistics?.averageRating ? `${clientData.statistics.averageRating}/5` : 'No rating')
                    }
                  </div>
                  <p className="text-xs text-gray-600">
                    {isFreelancer ? 'Current rate' : 'Client rating'}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                  <Calendar className="h-4 w-4 text-purple-600" />
                </CardHeader>                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatMemberSince(memberSince || '')}
                  </div>
                  <p className="text-xs text-gray-600">Join date</p>
                </CardContent>
              </Card>
            </div>            {/* Bio and Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>                <CardContent>
                  <p className="text-gray-600">
                    {isFreelancer 
                      ? (freelancerData?.profile?.bio || 'No bio provided yet.')
                      : (clientData?.profile?.bio || 'No bio provided yet.')
                    }
                  </p>
                </CardContent>
              </Card>

              {isFreelancer && (
                <Card className="bg-white border-gray-200">
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                  </CardHeader>                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {freelancerData?.professionalInfo?.skills ? (
                        // Handle skills as either array or comma-separated string
                        (Array.isArray(freelancerData.professionalInfo.skills) 
                          ? freelancerData.professionalInfo.skills 
                          : freelancerData.professionalInfo.skills.split(',').map(s => s.trim())
                        ).map((skill: string) => (
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
                    <CardTitle>Company Information</CardTitle>
                  </CardHeader>                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <span className="w-20 text-gray-500 font-medium">Company:</span>
                        <span>{clientData?.companyInfo?.companyName || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="w-20 text-gray-500 font-medium">Industry:</span>
                        <span>{clientData?.companyInfo?.industry || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="w-20 text-gray-500 font-medium">Website:</span>
                        {clientData?.companyInfo?.website ? (
                          <a href={clientData.companyInfo.website} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:underline">
                            {clientData.companyInfo.website}
                          </a>
                        ) : (
                          <span>Not specified</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {isFreelancer && (
                <Card className="bg-white border-gray-200">
                  <CardHeader>
                    <CardTitle>Portfolio Links</CardTitle>
                  </CardHeader>                  <CardContent>
                    <div className="space-y-2">
                      {freelancerData?.portfolioLinks?.github && (
                        <div className="flex items-center text-sm">
                          <span className="w-16 text-gray-500">GitHub:</span>
                          <a href={freelancerData.portfolioLinks.github} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:underline">
                            {freelancerData.portfolioLinks.github}
                          </a>
                        </div>
                      )}
                      {freelancerData?.portfolioLinks?.linkedin && (
                        <div className="flex items-center text-sm">
                          <span className="w-16 text-gray-500">LinkedIn:</span>
                          <a href={freelancerData.portfolioLinks.linkedin} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:underline">
                            {freelancerData.portfolioLinks.linkedin}
                          </a>
                        </div>
                      )}
                      {freelancerData?.portfolioLinks?.portfolio && (
                        <div className="flex items-center text-sm">
                          <span className="w-16 text-gray-500">Portfolio:</span>
                          <a href={freelancerData.portfolioLinks.portfolio} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:underline">
                            {freelancerData.portfolioLinks.portfolio}
                          </a>
                        </div>
                      )}
                      {(!freelancerData?.portfolioLinks?.github && !freelancerData?.portfolioLinks?.linkedin && !freelancerData?.portfolioLinks?.portfolio) && (
                        <p className="text-gray-500 text-sm">No portfolio links added yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>          <TabsContent value="portfolio">
            {isFreelancer ? (
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
            ) : (
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle>Posted Projects</CardTitle>
                  <CardDescription>Projects you have posted on the platform</CardDescription>
                </CardHeader>                <CardContent>
                  {profileData?.completedProjects && profileData.completedProjects.length > 0 ? (
                    <div className="space-y-4">
                      {profileData.completedProjects.map((project: any) => (
                        <div key={project.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-lg">{project.title}</h4>
                            <Badge 
                              variant="default"
                              className="bg-green-100 text-green-800"
                            >
                              COMPLETED
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {project.skillsRequired.map((skill: string) => (
                              <Badge key={skill} variant="outline">{skill}</Badge>
                            ))}
                          </div>
                          <div className="text-sm text-gray-500">
                            Budget: ₹{project.budget.min.toLocaleString()} - ₹{project.budget.max.toLocaleString()} • Duration: {project.duration}
                          </div>
                          {project.freelancer && (
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-sm text-gray-600">
                                Completed by: <strong>{project.freelancer.name}</strong> ({project.freelancer.experience} years experience)
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Completed Yet</h3>
                      <p className="text-gray-600 mb-6">Start posting projects to find talented freelancers</p>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Post a Project
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
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

export default PublicProfile;
