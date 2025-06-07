
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  User, 
  Github, 
  Linkedin, 
  Plus, 
  X, 
  Briefcase,
  Loader2,
  LogOut,
  MapPin,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { logout } from "@/lib/config/api";
import { freelancerService } from "@/lib/api/client";

const categories = {
  "IT & Software": [
    "Web Development",
    "Mobile Development", 
    "Data Science",
    "DevOps",
    "Cybersecurity",
    "Software Testing"
  ],
  "Design & Creative": [
    "UI/UX Design",
    "Graphic Design",
    "Video Editing",
    "Animation",
    "Photography",
    "Illustration"
  ],
  "Writing & Translation": [
    "Content Writing",
    "Copywriting",
    "Technical Writing",
    "Translation",
    "Proofreading",
    "Blogging"
  ],
  "Marketing": [
    "Digital Marketing",
    "SEO",
    "Social Media Marketing",
    "Email Marketing",
    "Content Marketing",
    "PPC Advertising"
  ]
};

const languages = [
  "English", "Hindi", "Bengali", "Tamil", "Telugu", "Marathi", 
  "Gujarati", "Kannada", "Malayalam", "Punjabi", "Spanish", 
  "French", "German", "Chinese", "Japanese", "Arabic"
];

const FreelancerProfileSetup = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasExistingProfile, setHasExistingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    location: "",
    age: "",
    skills: [] as string[],
    experience: "",
    hourlyRate: "",
    availability: true,
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: ""
  });

  const [newSkill, setNewSkill] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch existing profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const response = await freelancerService.getProfile();
        
        if (response.success && response.data) {
          setHasExistingProfile(true);
          const freelancerData = response.data.freelancer;
          setProfileData({
            name: freelancerData.name || "",
            bio: freelancerData.bio || "",
            location: freelancerData.location || "",
            age: freelancerData.age?.toString() || "",
            skills: Array.isArray(freelancerData.skills) 
              ? freelancerData.skills 
              : typeof freelancerData.skills === 'string' 
              ? freelancerData.skills.split(',').map(s => s.trim()).filter(s => s)
              : [],
            experience: freelancerData.experience || "",
            hourlyRate: freelancerData.hourlyRate?.toString() || "",
            availability: freelancerData.availability !== undefined ? freelancerData.availability : true,
            githubUrl: freelancerData.githubUrl || "",
            linkedinUrl: freelancerData.linkedinUrl || "",
            portfolioUrl: freelancerData.portfolioUrl || ""
          });
          
          toast({
            title: "Profile Loaded",
            description: "Your existing profile data has been loaded for editing.",
          });
        }
      } catch (error) {
        console.log('No existing profile found, starting fresh:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [toast]);

  const handleInputChange = (field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Prepare data for API
      const apiData = {
        name: profileData.name,
        bio: profileData.bio,
        location: profileData.location,
        age: parseInt(profileData.age) || undefined,
        skills: profileData.skills,
        experience: profileData.experience,
        hourlyRate: parseFloat(profileData.hourlyRate) || 0,
        availability: profileData.availability,
        githubUrl: profileData.githubUrl,
        linkedinUrl: profileData.linkedinUrl,
        portfolioUrl: profileData.portfolioUrl
      };

      if (hasExistingProfile) {
        await freelancerService.updateProfile(apiData);
        toast({
          title: "Profile Updated Successfully!",
          description: "Your changes have been saved.",
        });
      } else {
        await freelancerService.createProfile(apiData);
        toast({
          title: "Profile Created Successfully!",
          description: "Welcome to FreelanceHub. Your profile is now live.",
        });
      }
      
      navigate("/freelancer-dashboard");
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      {/* Header */}
      <header className="bg-white shadow-sm border-b mb-8">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <Link to="/" className="text-xl font-bold text-gray-900">FreelanceHub</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/profile')}>
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Loading State */}
          {isLoading ? (
            <Card className="shadow-xl border-0 bg-white">
              <CardContent className="p-8">
                <div className="flex flex-col items-center justify-center space-y-4 py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <p className="text-gray-600">Loading your profile data...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Header Section */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {hasExistingProfile ? 'Edit Your Freelancer Profile' : 'Set Up Your Freelancer Profile'}
                </h1>
                <p className="text-gray-600">
                  {hasExistingProfile 
                    ? 'Update your profile information to attract better opportunities' 
                    : 'Complete your profile to start finding amazing projects'
                  }
                </p>
              </div>

              {/* Success Message for Edit Mode */}
              {hasExistingProfile && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Editing Profile:</strong> Your existing profile data has been loaded. Make any changes and click "Update Profile" to save.
                  </p>
                </div>
              )}

              {/* Form Card */}
              <Card className="shadow-xl border-0 bg-white">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Basic Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                          Basic Information
                        </h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                            Full Name *
                          </Label>
                          <Input
                            id="name"
                            placeholder="Enter your full name"
                            value={profileData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className="border-gray-200 focus:border-blue-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                            Professional Bio *
                          </Label>
                          <Textarea
                            id="bio"
                            placeholder="Write a compelling bio highlighting your expertise and what makes you unique..."
                            value={profileData.bio}
                            onChange={(e) => handleInputChange("bio", e.target.value)}
                            className="min-h-[120px] border-gray-200 focus:border-blue-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                              Location *
                            </Label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <Input
                                id="location"
                                placeholder="City, Country"
                                value={profileData.location}
                                onChange={(e) => handleInputChange("location", e.target.value)}
                                className="pl-10 border-gray-200 focus:border-blue-500"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="age" className="text-sm font-medium text-gray-700">
                              Age *
                            </Label>
                            <Input
                              id="age"
                              type="number"
                              placeholder="Your age"
                              value={profileData.age}
                              onChange={(e) => handleInputChange("age", e.target.value)}
                              className="border-gray-200 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                          Skills & Expertise *
                        </h3>
                        
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border border-gray-200 rounded-lg">
                            {profileData.skills.length > 0 ? (
                              profileData.skills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                                  {skill}
                                  <X 
                                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                                    onClick={() => removeSkill(skill)}
                                  />
                                </Badge>
                              ))
                            ) : (
                              <p className="text-gray-400 text-sm">No skills added yet</p>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add a skill (e.g., React, Python, Design)"
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                              className="border-gray-200 focus:border-blue-500"
                            />
                            <Button onClick={addSkill} type="button" variant="outline">
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Experience & Rate */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                          Experience & Pricing
                        </h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="experience" className="text-sm font-medium text-gray-700">
                            Professional Experience *
                          </Label>
                          <Textarea
                            id="experience"
                            placeholder="Describe your professional experience, key achievements, and notable projects..."
                            value={profileData.experience}
                            onChange={(e) => handleInputChange("experience", e.target.value)}
                            className="min-h-[100px] border-gray-200 focus:border-blue-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="hourlyRate" className="text-sm font-medium text-gray-700">
                            Hourly Rate (₹) *
                          </Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              id="hourlyRate"
                              type="number"
                              placeholder="e.g., 1500"
                              value={profileData.hourlyRate}
                              onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                              className="pl-10 border-gray-200 focus:border-blue-500"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <Label htmlFor="availability" className="text-sm font-medium text-gray-700">
                              Available for Work
                            </Label>
                            <p className="text-xs text-gray-500">Toggle your availability status</p>
                          </div>
                          <Switch
                            id="availability"
                            checked={profileData.availability}
                            onCheckedChange={(checked) => handleInputChange("availability", checked)}
                          />
                        </div>
                      </div>

                      {/* Professional Links */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                          Professional Links
                        </h3>
                        
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor="githubUrl" className="text-sm font-medium text-gray-700">
                              GitHub Profile
                            </Label>
                            <div className="relative">
                              <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <Input
                                id="githubUrl"
                                placeholder="https://github.com/yourusername"
                                value={profileData.githubUrl}
                                onChange={(e) => handleInputChange("githubUrl", e.target.value)}
                                className="pl-10 border-gray-200 focus:border-blue-500"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="linkedinUrl" className="text-sm font-medium text-gray-700">
                              LinkedIn Profile
                            </Label>
                            <div className="relative">
                              <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <Input
                                id="linkedinUrl"
                                placeholder="https://linkedin.com/in/yourusername"
                                value={profileData.linkedinUrl}
                                onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                                className="pl-10 border-gray-200 focus:border-blue-500"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="portfolioUrl" className="text-sm font-medium text-gray-700">
                              Portfolio Website
                            </Label>
                            <Input
                              id="portfolioUrl"
                              placeholder="https://yourportfolio.com"
                              value={profileData.portfolioUrl}
                              onChange={(e) => handleInputChange("portfolioUrl", e.target.value)}
                              className="border-gray-200 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center mt-8 pt-6 border-t border-gray-200">
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700 px-12 py-3"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          {hasExistingProfile ? 'Updating Profile...' : 'Creating Profile...'}
                        </>
                      ) : (
                        hasExistingProfile ? 'Update Profile' : 'Create Profile & Start Freelancing'
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

export default FreelancerProfileSetup;
