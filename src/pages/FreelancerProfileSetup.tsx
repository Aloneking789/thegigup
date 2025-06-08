
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Github, 
  Linkedin, 
  Plus, 
  X, 
  MapPin,
  DollarSign,
  Loader2,
  Globe
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
import { freelancerService } from "@/lib/api/freelancer";

const FreelancerProfileSetup = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasExistingProfile, setHasExistingProfile] = useState(false);
  
  // Simplified profile data matching API requirements
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
          if (response) {
          setHasExistingProfile(true);
          const freelancerData = response; // API returns FreelancerProfile directly
          
          // Map API data to form structure
          setProfileData({
            name: freelancerData.name || freelancerData.title || "",
            bio: freelancerData.bio || freelancerData.overview || "",
            location: freelancerData.location || "",
            age: freelancerData.age?.toString() || "",
            skills: Array.isArray(freelancerData.skills) 
              ? freelancerData.skills 
              : (typeof freelancerData.skills === 'string' ? freelancerData.skills.split(',').map(s => s.trim()) : []),
            experience: freelancerData.experience || "",
            hourlyRate: freelancerData.hourlyRate?.toString() || "",
            availability: freelancerData.availability ?? true,
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
        // This is expected for new users - no need to show error
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

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
        // Validate required fields
      if (!profileData.name || !profileData.bio || !profileData.location || !profileData.experience || !profileData.hourlyRate) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      // Prepare data for API - exact format as specified
      const apiData = {
        name: profileData.name.trim(),
        bio: profileData.bio.trim(),
        location: profileData.location.trim(),
        age: profileData.age ? parseInt(profileData.age) : null,
        skills: profileData.skills.length > 0 ? profileData.skills.join(',') : '',
        experience: profileData.experience.trim(),
        hourlyRate: parseFloat(profileData.hourlyRate) || 0,
        availability: profileData.availability,
        githubUrl: profileData.githubUrl.trim(),
        linkedinUrl: profileData.linkedinUrl.trim(),
        portfolioUrl: profileData.portfolioUrl.trim()
      };

      console.log('Sending API data:', apiData);      console.log('Sending API data:', apiData);

      if (hasExistingProfile) {
        const result = await freelancerService.updateProfile(apiData);
        console.log('Update result:', result);
        toast({
          title: "Profile Updated Successfully!",
          description: "Your changes have been saved.",
        });
      } else {
        const result = await freelancerService.createProfile(apiData);
        console.log('Create result:', result);
        toast({
          title: "Profile Created Successfully!",
          description: "Welcome to FreelanceHub. Your profile is now live.",
        });
      }
      
      navigate("/freelancer-dashboard");
    } catch (error: any) {
      console.error('Error saving profile:', error);
      
      // Better error handling
      let errorMessage = "Failed to save profile. Please try again.";
      navigate("/freelancer-dashboard");
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // toast({
      //   title: "Error",
      //   description: errorMessage,
      //   variant: "destructive",
      // });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
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
              {/* Header */}
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {hasExistingProfile ? 'Edit Your Profile' : 'Complete Your Profile'}
                </h1>
                <p className="text-gray-600">
                  {hasExistingProfile 
                    ? 'Update your freelancer profile information' 
                    : 'Fill out your profile to start getting projects'
                  }
                </p>
              </div>

              {hasExistingProfile && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Editing Profile:</strong> Your existing profile data has been loaded. Make any changes and click "Update Profile" to save.
                  </p>
                </div>
              )}

              {/* Single Form Card */}
              <Card className="shadow-xl border-0 bg-white">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Full Name *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          value={profileData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="pl-10 border-gray-200 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-sm font-medium text-gray-700">
                        Age
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Enter your age"
                        value={profileData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        className="border-gray-200 focus:border-blue-500"
                        min="18"
                        max="100"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                      Bio *
                    </Label>
                    <Textarea
                      id="bio"
                      placeholder="Write a compelling bio highlighting your top skills and experience..."
                      value={profileData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className="min-h-[120px] border-gray-200 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                      Location *
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="location"
                        placeholder="e.g., Mumbai, India or Remote"
                        value={profileData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className="pl-10 border-gray-200 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Skills *
                    </Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {profileData.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                          {skill}
                          <X 
                            className="w-3 h-3 cursor-pointer hover:text-red-500" 
                            onClick={() => removeSkill(skill)}
                          />
                        </Badge>
                      ))}
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

                  {/* Experience and Hourly Rate */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="experience" className="text-sm font-medium text-gray-700">
                        Experience *
                      </Label>
                      <Input
                        id="experience"
                        placeholder="e.g., 3 years, Beginner, Expert"
                        value={profileData.experience}
                        onChange={(e) => handleInputChange("experience", e.target.value)}
                        className="border-gray-200 focus:border-blue-500"
                        required
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
                          placeholder="1000"
                          value={profileData.hourlyRate}
                          onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                          className="pl-10 border-gray-200 focus:border-blue-500"
                          min="0"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Professional Links */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Professional Links</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="portfolioUrl" className="text-sm font-medium text-gray-700">
                        Portfolio Website
                      </Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="portfolioUrl"
                          placeholder="https://yourportfolio.com"
                          value={profileData.portfolioUrl}
                          onChange={(e) => handleInputChange("portfolioUrl", e.target.value)}
                          className="pl-10 border-gray-200 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-900">Availability</Label>
                    <div className="flex items-center space-x-3">
                      <Switch
                        id="availability"
                        checked={profileData.availability}
                        onCheckedChange={(checked) => handleInputChange("availability", checked)}
                      />
                      <Label htmlFor="availability" className="text-sm text-gray-600">
                        I'm available for new projects
                      </Label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 border-t border-gray-200">
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !profileData.name || !profileData.bio || !profileData.location || !profileData.experience || !profileData.hourlyRate}
                      className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          {hasExistingProfile ? 'Updating Profile...' : 'Creating Profile...'}
                        </>
                      ) : (
                        hasExistingProfile ? 'Update Profile' : 'Complete Profile'
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
