import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Building, 
  MapPin, 
  Globe,
  Briefcase,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { API_CONFIG, TokenStorage } from "@/lib/config/api";

const industries = [
  "Technology",
  "Healthcare", 
  "Finance",
  "Education",
  "E-commerce",
  "Manufacturing",
  "Real Estate",
  "Marketing & Advertising",
  "Consulting",
  "Non-profit",
  "Government",
  "Entertainment",
  "Food & Beverage",
  "Transportation",
  "Other"
];

const ClientProfileSetup = () => {
  const [profileData, setProfileData] = useState({
    companyName: "",
    industry: "",
    website: "",
    bio: "",
    location: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch existing profile data on component mount
  useEffect(() => {
    const fetchExistingProfile = async () => {
      try {
        const token = localStorage.getItem('clienttoken');
        if (!token) {
          setIsLoadingProfile(false);
          return;
        }

        const response = await fetch(`${API_CONFIG.BASE_URL}/client/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const existingProfile = await response.json();
          if (existingProfile) {
            setProfileData({
              companyName: existingProfile.companyName || "",
              industry: existingProfile.industry || "",
              website: existingProfile.website || "",
              bio: existingProfile.bio || "",
              location: existingProfile.location || ""
            });
            setIsEditMode(true);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchExistingProfile();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSubmit = async () => {
    // Validate required fields
    if (!profileData.companyName || !profileData.industry || !profileData.location) {
      toast({
        title: "Incomplete Profile",
        description: "Please fill in all required fields (Company Name, Industry, Location)",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('clienttoken');
      console.log(token);
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in again to continue.",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }

      // Use PUT for updates, POST for initial creation
      const method = isEditMode ? 'PUT' : 'PUT';
      console.log(token);
      const response = await fetch(`${API_CONFIG.BASE_URL}/client/profile`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditMode ? 'update' : 'create'} profile`);
      }

      toast({
        title: `Profile ${isEditMode ? 'Updated' : 'Created'} Successfully!`,
        description: `Welcome to TheGigUp. You can now ${isEditMode ? 'continue using the platform' : 'start posting projects'}.`,
      });
      navigate("/client-dashboard");
    } catch (error) {
      console.error('Profile operation error:', error);
      toast({
        title: `Profile ${isEditMode ? 'Update' : 'Creation'} Failed`,
        description: `There was an error ${isEditMode ? 'updating' : 'creating'} your profile. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Loading screen while fetching profile */}
          {isLoadingProfile ? (
            <div className="flex justify-center items-center min-h-screen">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">Loading your profile...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {isEditMode ? 'Update Your Client Profile' : 'Complete Your Client Profile'}
                </h1>
                <p className="text-gray-600">
                  {isEditMode 
                    ? 'Update your company profile information' 
                    : 'Set up your company profile to start hiring talented freelancers'
                  }
                </p>
              </div>

          {/* Form Card */}
          <Card className="shadow-xl border-0 bg-white">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">Company Information</CardTitle>
              <p className="text-gray-600">Tell freelancers about your business</p>
            </CardHeader>
            
            <CardContent className="p-8 space-y-6">
              {/* Company Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Enter your company name"
                    value={profileData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-500"
                    required
                  />
                </div>
              </div>              {/* Industry */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Industry <span className="text-red-500">*</span>
                </label>
                <Select 
                  value={profileData.industry} 
                  onValueChange={(value) => handleInputChange("industry", value)}
                >
                  <SelectTrigger className="border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Website */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Company Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="https://your-company-website.com"
                    value={profileData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-500"
                    type="url"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="City, State/Country"
                    value={profileData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Company Bio</label>
                <Textarea
                  placeholder="Tell freelancers about your company, values, and what kind of working relationship you prefer..."
                  value={profileData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="min-h-[120px] border-gray-200 focus:border-blue-500"
                />
              </div>

              {/* Profile Summary */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Profile Summary</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Company:</span>
                    <span className="ml-2 text-gray-600">{profileData.companyName || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Industry:</span>
                    <span className="ml-2 text-gray-600">{profileData.industry || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Website:</span>
                    <span className="ml-2 text-gray-600">{profileData.website || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Location:</span>
                    <span className="ml-2 text-gray-600">{profileData.location || "Not provided"}</span>
                  </div>
                </div>

                {profileData.bio && (
                  <div>
                    <span className="font-medium text-gray-700">Bio:</span>
                    <p className="mt-1 text-gray-600 text-sm">{profileData.bio}</p>
                  </div>
                )}
              </div>              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {isEditMode ? 'Updating Profile...' : 'Creating Profile...'}
                    </>
                  ) : (
                    isEditMode ? 'Update Profile' : 'Complete Profile & Start Hiring'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientProfileSetup;
