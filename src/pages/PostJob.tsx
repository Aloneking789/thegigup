
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Briefcase,
  Settings,
  ArrowLeft,
  ArrowRight,
  DollarSign,
  Clock,
  Users,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const PostJob = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    skills: [] as string[],
    budget: "",
    budgetType: "fixed", // fixed or hourly
    timeframe: "",
    isUrgent: false,
    isExperienced: false,
    projectType: "",
    additionalDetails: ""
  });

  const skillOptions = [
    "React", "Node.js", "Python", "JavaScript", "TypeScript", "PHP", "Java",
    "Figma", "Adobe XD", "Photoshop", "UI/UX Design", "Graphic Design",
    "Content Writing", "SEO", "Social Media Marketing", "Digital Marketing"
  ];

  const categories = {
    "IT & Software": ["Web Development", "Mobile Development", "Desktop Applications", "DevOps & Cloud"],
    "Design & Creative": ["UI/UX Design", "Graphic Design", "Logo Design", "Branding"],
    "Writing & Translation": ["Content Writing", "Copywriting", "Technical Writing", "Translation"],
    "Marketing": ["Digital Marketing", "SEO", "Social Media", "Email Marketing"]
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
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
      title: "Job Posted Successfully!",
      description: "Your job has been posted and is now live for freelancers to apply.",
    });
    navigate("/client-dashboard");
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
        <Input
          placeholder="e.g., Build a responsive website with React"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="border-gray-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
        <Textarea
          placeholder="Describe your project in detail..."
          rows={6}
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="border-gray-200"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value, subcategory: ""})}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(categories).map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
          <Select value={formData.subcategory} onValueChange={(value) => setFormData({...formData, subcategory: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select subcategory" />
            </SelectTrigger>
            <SelectContent>
              {formData.category && categories[formData.category as keyof typeof categories]?.map((subcat) => (
                <SelectItem key={subcat} value={subcat}>{subcat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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
          <div className="mt-3 flex flex-wrap gap-2">
            {formData.skills.map((skill) => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Budget Type</label>
        <div className="grid grid-cols-2 gap-4">
          <Card className={`cursor-pointer border-2 ${formData.budgetType === 'fixed' ? 'border-blue-600' : 'border-gray-200'}`} onClick={() => setFormData({...formData, budgetType: 'fixed'})}>
            <CardContent className="p-4 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold">Fixed Price</h3>
              <p className="text-sm text-gray-600">Pay a fixed amount for the entire project</p>
            </CardContent>
          </Card>
          <Card className={`cursor-pointer border-2 ${formData.budgetType === 'hourly' ? 'border-blue-600' : 'border-gray-200'}`} onClick={() => setFormData({...formData, budgetType: 'hourly'})}>
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold">Hourly Rate</h3>
              <p className="text-sm text-gray-600">Pay by the hour for ongoing work</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {formData.budgetType === 'fixed' ? 'Project Budget' : 'Hourly Rate Range'}
        </label>
        <Input
          placeholder={formData.budgetType === 'fixed' ? "e.g., ₹50,000 - ₹75,000" : "e.g., ₹500 - ₹1,200 per hour"}
          value={formData.budget}
          onChange={(e) => setFormData({...formData, budget: e.target.value})}
          className="border-gray-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Project Duration</label>
        <Select value={formData.timeframe} onValueChange={(value) => setFormData({...formData, timeframe: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="less-than-1-week">Less than 1 week</SelectItem>
            <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
            <SelectItem value="1-month">1 month</SelectItem>
            <SelectItem value="2-3-months">2-3 months</SelectItem>
            <SelectItem value="more-than-3-months">More than 3 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Project Tags</label>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="urgent"
              checked={formData.isUrgent}
              onCheckedChange={(checked) => setFormData({...formData, isUrgent: checked as boolean})}
            />
            <label htmlFor="urgent" className="text-sm text-gray-700">
              Mark as Urgent (attracts immediate attention)
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="experienced"
              checked={formData.isExperienced}
              onCheckedChange={(checked) => setFormData({...formData, isExperienced: checked as boolean})}
            />
            <label htmlFor="experienced" className="text-sm text-gray-700">
              Experienced freelancers only (3+ years experience)
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
        <Select value={formData.projectType} onValueChange={(value) => setFormData({...formData, projectType: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select project type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="one-time">One-time project</SelectItem>
            <SelectItem value="ongoing">Ongoing work</SelectItem>
            <SelectItem value="contract-to-hire">Contract to hire</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Details</label>
        <Textarea
          placeholder="Any additional requirements, deliverables, or special instructions..."
          rows={4}
          value={formData.additionalDetails}
          onChange={(e) => setFormData({...formData, additionalDetails: e.target.value})}
          className="border-gray-200"
        />
      </div>

      {/* Job Preview */}
      <Card className="bg-gray-50 border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Job Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{formData.title}</h3>
            <div className="flex items-center gap-2 mt-2">
              {formData.isUrgent && <Badge className="bg-red-100 text-red-800">URGENT</Badge>}
              {formData.isExperienced && <Badge className="bg-purple-100 text-purple-800">EXPERIENCED</Badge>}
            </div>
          </div>
          <p className="text-gray-600">{formData.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Budget:</span> {formData.budget} ({formData.budgetType})
            </div>
            <div>
              <span className="font-medium">Duration:</span> {formData.timeframe}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill) => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

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
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/find-talent" className="text-gray-600 hover:text-blue-600">Find Talent</Link>
              <Link to="/find-work" className="text-gray-600 hover:text-blue-600">Find Work</Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-600">About</Link>
              <Link to="/profile" className="text-gray-600 hover:text-blue-600">Profile</Link>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">Post a Job</h1>
              <div className="text-sm text-gray-600">Step {currentStep} of 3</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && "Job Details"}
                {currentStep === 2 && "Budget & Timeline"}
                {currentStep === 3 && "Review & Post"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Tell us about your project and requirements"}
                {currentStep === 2 && "Set your budget and project timeline"}
                {currentStep === 3 && "Review your job post and publish"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 ? (
              <Button variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            ) : (
              <div></div>
            )}
            
            {currentStep < 3 ? (
              <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                <FileText className="w-4 h-4 mr-2" />
                Post Job
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
