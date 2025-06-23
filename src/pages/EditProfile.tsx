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
  Globe,
  Building,
  Camera,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { clientService, freelancerService } from "@/lib/api/client";
import { FreelancerProfileResponse, ClientProfileResponse } from "@/lib/api/types";

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

const EditProfile = () => {
  const [userRole, setUserRole] = useState<'FREELANCER' | 'CLIENT' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Freelancer specific state
  const [freelancerData, setFreelancerData] = useState({
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

  // Client specific state
  const [clientData, setClientData] = useState({
    name: "",
    bio: "",
    location: "",
    companyName: "",
    industry: "",
    website: ""
  });

  const [newSkill, setNewSkill] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        
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
          if (response?.success && response.data) {
            const data = response.data;
            const freelancer = data.freelancer;
            
            setProfileData(data);
            setFreelancerData({
              name: data.name || "",
              bio: data.bio || "",
              location: data.location || "",
              age: freelancer?.age?.toString() || "",
              skills: Array.isArray(freelancer?.skills) ? freelancer.skills : [],
              experience: freelancer?.experience || "",
              hourlyRate: freelancer?.hourlyRate?.toString() || "",
              availability: freelancer?.availability ?? true,
              githubUrl: freelancer?.githubUrl || "",
              linkedinUrl: freelancer?.linkedinUrl || "",
              portfolioUrl: freelancer?.portfolioUrl || ""
            });
            setImagePreview(data.profileImage);
          }
        } else if (role === 'CLIENT') {
          response = await clientService.getProfile();
          if (response?.success && response.data) {
            const data = response.data;
            setProfileData(data);
            setClientData({
              name: data.name || "",
              bio: data.bio || "",
              location: data.location || "",
              companyName: data.companyName || "",
              industry: data.industry || "",
              website: data.website || ""
            });
            setImagePreview(data.profileImage);
          }
        }
        
      } catch (err) {
        console.error('Profile fetch error:', err);
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive"
        });
        navigate('/profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [toast, navigate]);

  const handleInputChange = (field: string, value: any) => {
    if (userRole === 'FREELANCER') {
      setFreelancerData(prev => ({
        ...prev,
        [field]: value
      }));
    } else {
      setClientData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !freelancerData.skills.includes(newSkill.trim())) {
      setFreelancerData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setFreelancerData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      if (userRole === 'FREELANCER') {
        // Validate required fields
        if (!freelancerData.name || !freelancerData.bio || !freelancerData.location || !freelancerData.experience || !freelancerData.hourlyRate) {
          toast({
            title: "Incomplete Profile",
            description: "Please fill in all required fields.",
            variant: "destructive"
          });
          return;
        }        // Prepare freelancer data for API - use FormData if image is selected
        if (selectedImage) {
          // Send both profile data and image together using FormData
          const formData = new FormData();
          formData.append('name', freelancerData.name);
          formData.append('bio', freelancerData.bio);
          formData.append('location', freelancerData.location);
          if (freelancerData.age) formData.append('age', freelancerData.age);
          formData.append('skills', freelancerData.skills.join(','));
          formData.append('experience', freelancerData.experience);
          formData.append('hourlyRate', freelancerData.hourlyRate);
          formData.append('availability', freelancerData.availability.toString());
          if (freelancerData.githubUrl) formData.append('githubUrl', freelancerData.githubUrl);
          if (freelancerData.linkedinUrl) formData.append('linkedinUrl', freelancerData.linkedinUrl);
          if (freelancerData.portfolioUrl) formData.append('portfolioUrl', freelancerData.portfolioUrl);
          formData.append('profileImage', selectedImage);

          await freelancerService.updateProfileWithImage(formData);
        } else {
          // Send just the profile data as JSON
          const apiData = {
            name: freelancerData.name,
            bio: freelancerData.bio,
            location: freelancerData.location,
            age: parseInt(freelancerData.age) || null,
            skills: freelancerData.skills.join(','),
            experience: freelancerData.experience,
            hourlyRate: parseFloat(freelancerData.hourlyRate) || 0,
            availability: freelancerData.availability,
            githubUrl: freelancerData.githubUrl,
            linkedinUrl: freelancerData.linkedinUrl,
            portfolioUrl: freelancerData.portfolioUrl
          };

          await freelancerService.updateProfile(apiData);
        }

      } else if (userRole === 'CLIENT') {
        // Validate required fields
        if (!clientData.name || !clientData.location) {
          toast({
            title: "Incomplete Profile",
            description: "Please fill in all required fields.",
            variant: "destructive"
          });
          return;
        }        // Prepare client data for API - use FormData if image is selected
        if (selectedImage) {
          // Send both profile data and image together using FormData
          const formData = new FormData();
          formData.append('name', clientData.name);
          formData.append('bio', clientData.bio);
          formData.append('location', clientData.location);
          if (clientData.companyName) formData.append('companyName', clientData.companyName);
          if (clientData.industry) formData.append('industry', clientData.industry);
          if (clientData.website) formData.append('website', clientData.website);
          formData.append('profileImage', selectedImage);

          await clientService.updateProfileWithImage(formData);
        } else {
          // Send just the profile data as JSON
          const apiData = {
            name: clientData.name,
            bio: clientData.bio,
            location: clientData.location,
            companyName: clientData.companyName,
            industry: clientData.industry,
            website: clientData.website
          };

          await clientService.updateProfile(apiData);
        }
      }
      
      toast({
        title: "Profile Updated Successfully!",
        description: "Your changes have been saved.",
      });
      
      navigate("/profile");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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

  const isFreelancer = userRole === 'FREELANCER';
  const currentData = isFreelancer ? freelancerData : clientData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h1>
            <p className="text-gray-600">
              Update your {isFreelancer ? 'freelancer' : 'client'} profile information
            </p>
          </div>

          <Card className="shadow-xl border-0 bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {/* Profile Image */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={imagePreview || undefined} />
                    <AvatarFallback className="text-2xl">
                      {currentData.name?.split(" ").map(n => n[0]).join("") || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    size="sm" 
                    className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0"
                    onClick={() => document.getElementById('profile-image-input')?.click()}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                  <input
                    id="profile-image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-gray-500 text-center">Click the camera icon to change your profile picture</p>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    {isFreelancer ? 'Full Name' : 'Your Name'} *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={currentData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="pl-10 border-gray-200 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {isFreelancer && (
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm font-medium text-gray-700">
                      Age
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter your age"
                      value={freelancerData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      className="border-gray-200 focus:border-blue-500"
                      min="18"
                      max="100"
                    />
                  </div>
                )}

                {!isFreelancer && (
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                      Company Name
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="companyName"
                        placeholder="Enter company name"
                        value={clientData.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                        className="pl-10 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                  {isFreelancer ? 'Bio' : 'Company Description'} *
                </Label>
                <Textarea
                  id="bio"
                  placeholder={isFreelancer ? "Write a compelling bio highlighting your skills..." : "Tell freelancers about your company..."}
                  value={currentData.bio}
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
                    value={currentData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Client-specific fields */}
              {!isFreelancer && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Industry</Label>
                    <Select 
                      value={clientData.industry} 
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

                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-sm font-medium text-gray-700">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="website"
                        placeholder="https://company-website.com"
                        value={clientData.website}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                        className="pl-10 border-gray-200 focus:border-blue-500"
                        type="url"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Freelancer-specific fields */}
              {isFreelancer && (
                <>
                  {/* Skills */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Skills *</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {freelancerData.skills.map((skill) => (
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
                        value={freelancerData.experience}
                        onChange={(e) => handleInputChange("experience", e.target.value)}
                        className="border-gray-200 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate" className="text-sm font-medium text-gray-700">
                        Hourly Rate ($) *
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="hourlyRate"
                          type="number"
                          placeholder="1000"
                          value={freelancerData.hourlyRate}
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
                            value={freelancerData.githubUrl}
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
                            value={freelancerData.linkedinUrl}
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
                          value={freelancerData.portfolioUrl}
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
                        checked={freelancerData.availability}
                        onCheckedChange={(checked) => handleInputChange("availability", checked)}
                      />
                      <Label htmlFor="availability" className="text-sm text-gray-600">
                        I'm available for new projects
                      </Label>
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/profile')}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Profile'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
