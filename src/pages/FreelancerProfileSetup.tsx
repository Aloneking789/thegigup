
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Calendar, 
  Github, 
  Linkedin, 
  Upload, 
  Plus, 
  X, 
  Briefcase,
  Camera,
  Globe,
  Code,
  Building,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

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
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    name: "",
    profilePic: "",
    dateOfBirth: "",
    languages: [] as string[],
    github: "",
    linkedin: "",
    role: "",
    bio: "",
    skills: [] as string[],
    resume: null as File | null,
    workExperience: [
      {
        id: 1,
        company: "",
        title: "",
        startDate: "",
        endDate: "",
        description: ""
      }
    ],
    category: "",
    subcategory: "",
    projects: [
      {
        id: 1,
        title: "",
        description: "",
        link: "",
        image: ""
      }
    ],
    hourlyRate: ""
  });

  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const totalSteps = 6;

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

  const addLanguage = (language: string) => {
    if (!profileData.languages.includes(language)) {
      setProfileData(prev => ({
        ...prev,
        languages: [...prev.languages, language]
      }));
    }
  };

  const removeLanguage = (language: string) => {
    setProfileData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }));
  };

  const addWorkExperience = () => {
    const newId = Math.max(...profileData.workExperience.map(w => w.id)) + 1;
    setProfileData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, {
        id: newId,
        company: "",
        title: "",
        startDate: "",
        endDate: "",
        description: ""
      }]
    }));
  };

  const updateWorkExperience = (id: number, field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeWorkExperience = (id: number) => {
    setProfileData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter(exp => exp.id !== id)
    }));
  };

  const addProject = () => {
    const newId = Math.max(...profileData.projects.map(p => p.id)) + 1;
    setProfileData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        id: newId,
        title: "",
        description: "",
        link: "",
        image: ""
      }]
    }));
  };

  const updateProject = (id: number, field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      projects: prev.projects.map(project => 
        project.id === id ? { ...project, [field]: value } : project
      )
    }));
  };

  const removeProject = (id: number) => {
    setProfileData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Profile Created Successfully!",
      description: "Welcome to FreelanceHub. Your profile is now live.",
    });
    navigate("/freelancer-dashboard");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
              <p className="text-gray-600">Let's start with your basic details</p>
            </div>
            
            <div className="space-y-4">
              {/* Profile Picture */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profileData.profilePic} />
                  <AvatarFallback>
                    <Camera className="w-8 h-8 text-gray-400" />
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <Input
                  placeholder="Enter your full name"
                  value={profileData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="border-gray-200 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                <Input
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  className="border-gray-200 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Languages</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {profileData.languages.map((language) => (
                    <Badge key={language} variant="secondary" className="flex items-center gap-1">
                      {language}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeLanguage(language)}
                      />
                    </Badge>
                  ))}
                </div>
                <Select onValueChange={addLanguage}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="Select languages you speak" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.filter(lang => !profileData.languages.includes(lang)).map((language) => (
                      <SelectItem key={language} value={language}>{language}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Links</h2>
              <p className="text-gray-600">Add your professional profiles for verification</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">GitHub Profile</label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="https://github.com/yourusername"
                    value={profileData.github}
                    onChange={(e) => handleInputChange("github", e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">LinkedIn Profile</label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="https://linkedin.com/in/yourusername"
                    value={profileData.linkedin}
                    onChange={(e) => handleInputChange("linkedin", e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Professional Role</label>
                <Input
                  placeholder="e.g., Full Stack Developer, UI/UX Designer"
                  value={profileData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className="border-gray-200 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Bio & Skills</h2>
              <p className="text-gray-600">Tell us about yourself and your expertise</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Bio</label>
                <Textarea
                  placeholder="Write a compelling bio highlighting your top skills and strengths..."
                  value={profileData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="min-h-[120px] border-gray-200 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Skills</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {profileData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    className="border-gray-200 focus:border-blue-500"
                  />
                  <Button onClick={addSkill} type="button">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Resume Upload</label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload your resume (PDF, DOC)</p>
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Work Experience</h2>
              <p className="text-gray-600">Add your professional experience</p>
            </div>
            
            <div className="space-y-4">
              {profileData.workExperience.map((exp, index) => (
                <Card key={exp.id} className="border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Experience {index + 1}</CardTitle>
                      {profileData.workExperience.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeWorkExperience(exp.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Company</label>
                        <Input
                          placeholder="Company name"
                          value={exp.company}
                          onChange={(e) => updateWorkExperience(exp.id, "company", e.target.value)}
                          className="border-gray-200 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Job Title</label>
                        <Input
                          placeholder="Your job title"
                          value={exp.title}
                          onChange={(e) => updateWorkExperience(exp.id, "title", e.target.value)}
                          className="border-gray-200 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Start Date</label>
                        <Input
                          type="date"
                          value={exp.startDate}
                          onChange={(e) => updateWorkExperience(exp.id, "startDate", e.target.value)}
                          className="border-gray-200 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">End Date</label>
                        <Input
                          type="date"
                          value={exp.endDate}
                          onChange={(e) => updateWorkExperience(exp.id, "endDate", e.target.value)}
                          className="border-gray-200 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <Textarea
                        placeholder="Describe your role and achievements..."
                        value={exp.description}
                        onChange={(e) => updateWorkExperience(exp.id, "description", e.target.value)}
                        className="border-gray-200 focus:border-blue-500"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button 
                variant="outline" 
                onClick={addWorkExperience}
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Experience
              </Button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Category & Subcategory</h2>
              <p className="text-gray-600">Select your area of expertise</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <Select onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="Select your main category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(categories).map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {profileData.category && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Subcategory</label>
                  <Select onValueChange={(value) => handleInputChange("subcategory", value)}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-500">
                      <SelectValue placeholder="Select your subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories[profileData.category as keyof typeof categories].map((subcategory) => (
                        <SelectItem key={subcategory} value={subcategory}>{subcategory}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Hourly Rate (₹)</label>
                <Input
                  type="number"
                  placeholder="e.g., 1000"
                  value={profileData.hourlyRate}
                  onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                  className="border-gray-200 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Projects Portfolio</h2>
              <p className="text-gray-600">Showcase your best work</p>
            </div>
            
            <div className="space-y-4">
              {profileData.projects.map((project, index) => (
                <Card key={project.id} className="border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Project {index + 1}</CardTitle>
                      {profileData.projects.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeProject(project.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Project Title</label>
                      <Input
                        placeholder="Enter project title"
                        value={project.title}
                        onChange={(e) => updateProject(project.id, "title", e.target.value)}
                        className="border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <Textarea
                        placeholder="Describe your project..."
                        value={project.description}
                        onChange={(e) => updateProject(project.id, "description", e.target.value)}
                        className="border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Project Link</label>
                      <Input
                        placeholder="https://your-project-link.com"
                        value={project.link}
                        onChange={(e) => updateProject(project.id, "link", e.target.value)}
                        className="border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Project Image</label>
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Upload project screenshot</p>
                        <Button variant="outline" size="sm">
                          Choose Image
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button 
                variant="outline" 
                onClick={addProject}
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Project
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Card */}
          <Card className="shadow-xl border-0 bg-white">
            <CardContent className="p-8">
              {renderStep()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="border-gray-300"
                >
                  Previous
                </Button>
                
                {currentStep === totalSteps ? (
                  <Button
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Complete Profile
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Next Step
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfileSetup;
