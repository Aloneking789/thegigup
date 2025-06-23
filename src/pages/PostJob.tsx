
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Briefcase,
  Settings,
  FileText,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { clientService } from "@/lib/api/client";
import { isLoggedIn, RoleStorage, logout } from "@/lib/config/api";
import MobileNav from "@/components/MobileNav";

const PostJob = () => {  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // User state management
  const [userProfile, setUserProfile] = useState<{
    name: string;
    email: string;
    profileImage?: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: [] as string[],
    budgetMin: "",
    budgetMax: "",
    duration: ""
  });

  const skillOptions = [
    "React", "Node.js", "Python", "JavaScript", "TypeScript", "PHP", "Java",
    "Figma", "Adobe XD", "Photoshop", "UI/UX Design", "Graphic Design",
    "Content Writing", "SEO", "Social Media Marketing", "Digital Marketing",
    "HTML", "CSS", "MongoDB", "PostgreSQL", "Express.js", "Vue.js", "Angular"  ];

  // Initialize user state
  useEffect(() => {
    const storedUserName = localStorage.getItem('userName') || 'User';
    const storedUserEmail = localStorage.getItem('userEmail') || '';
    setUserProfile({
      name: storedUserName,
      email: storedUserEmail,
      profileImage: undefined
    });
  }, []);

  // Check if user is logged in and is a client
  if (!isLoggedIn() || !RoleStorage.isClient()) {
    navigate('/login');
    return null;
  }

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a job title.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.description.trim()) {
      toast({
        title: "Error",
        description: "Please enter a job description.",
        variant: "destructive",
      });
      return false;
    }
    
    if (formData.skills.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one skill.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.budgetMin || !formData.budgetMax) {
      toast({
        title: "Error",
        description: "Please enter both minimum and maximum budget.",
        variant: "destructive",
      });
      return false;
    }
    
    const minBudget = parseFloat(formData.budgetMin);
    const maxBudget = parseFloat(formData.budgetMax);
    
    if (isNaN(minBudget) || isNaN(maxBudget)) {
      toast({
        title: "Error",
        description: "Please enter valid budget amounts.",
        variant: "destructive",
      });
      return false;
    }
    
    if (minBudget >= maxBudget) {
      toast({
        title: "Error",
        description: "Maximum budget must be greater than minimum budget.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.duration) {
      toast({
        title: "Error",
        description: "Please select a project duration.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        skillsRequired: formData.skills.join(','),
        budgetMin: parseFloat(formData.budgetMin),
        budgetMax: parseFloat(formData.budgetMax),
        duration: formData.duration
      };

      console.log('Creating project with data:', projectData);
      const response = await clientService.createProject(projectData);
      
      if (response.success) {
        toast({
          title: "Job Posted Successfully!",
          description: "Your job has been posted and is now live for freelancers to apply.",
        });
        navigate("/client-dashboard");
      } else {
        throw new Error(response.message || 'Failed to create project');
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to post job. Please try again.",
        variant: "destructive",
      });    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
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
              <Link to="/" className="text-xl font-bold text-gray-900">TheGigUp</Link>
            </div>            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/client-dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
              <Link to="/find-talent" className="text-gray-600 hover:text-blue-600">Find Talent</Link>
              <Link to="/profile" className="text-gray-600 hover:text-blue-600">Profile</Link>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Logout
              </Button>
            </nav>
            <MobileNav 
              userLoggedIn={true}
              userRole="CLIENT"
              userProfile={userProfile}
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Job</h1>
            <p className="text-gray-600">Fill in the essential details to post your job and start receiving applications.</p>
          </div>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>
                Provide the essential information about your project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g., Build a responsive website with React"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="border-gray-200"
                />
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <Textarea
                  placeholder="Describe your project requirements, deliverables, and expectations..."
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="border-gray-200"
                />
              </div>

              {/* Skills Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills Required <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                  {skillOptions.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={skill}
                        checked={formData.skills.includes(skill)}
                        onCheckedChange={() => handleSkillToggle(skill)}
                      />
                      <label htmlFor={skill} className="text-sm text-gray-700">{skill}</label>
                    </div>
                  ))}
                </div>
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range ($) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Minimum Budget</label>
                    <Input
                      type="number"
                      placeholder="e.g., 500"
                      value={formData.budgetMin}
                      onChange={(e) => setFormData({...formData, budgetMin: e.target.value})}
                      className="border-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Maximum Budget</label>
                    <Input
                      type="number"
                      placeholder="e.g., 1500"
                      value={formData.budgetMax}
                      onChange={(e) => setFormData({...formData, budgetMax: e.target.value})}
                      className="border-gray-200"
                    />
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Duration <span className="text-red-500">*</span>
                </label>
                <Select value={formData.duration} onValueChange={(value) => setFormData({...formData, duration: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less than 1 week">Less than 1 week</SelectItem>
                    <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                    <SelectItem value="2 weeks">2 weeks</SelectItem>
                    <SelectItem value="1 month">1 month</SelectItem>
                    <SelectItem value="2-3 months">2-3 months</SelectItem>
                    <SelectItem value="more than 3 months">More than 3 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Job Preview */}
              {(formData.title || formData.description || formData.skills.length > 0 || formData.budgetMin || formData.budgetMax || formData.duration) && (
                <Card className="bg-gray-50 border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Job Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {formData.title && (
                      <div>
                        <h3 className="font-semibold text-lg">{formData.title}</h3>
                      </div>
                    )}
                    {formData.description && (
                      <p className="text-gray-600">{formData.description}</p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {(formData.budgetMin || formData.budgetMax) && (
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                          <span className="font-medium">Budget:</span>
                          <span className="ml-1">
                            {formData.budgetMin && formData.budgetMax 
                              ? `$${parseFloat(formData.budgetMin).toLocaleString()} - $${parseFloat(formData.budgetMax).toLocaleString()}`
                              : formData.budgetMin 
                                ? `$${parseFloat(formData.budgetMin).toLocaleString()}+`
                                : formData.budgetMax 
                                  ? `Up to $${parseFloat(formData.budgetMax).toLocaleString()}`
                                  : ''
                            }
                          </span>
                        </div>
                      )}
                      {formData.duration && (
                        <div>
                          <span className="font-medium">Duration:</span> {formData.duration}
                        </div>
                      )}
                    </div>
                    {formData.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 px-8"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Posting Job...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Post Job
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
