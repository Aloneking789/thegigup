
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Briefcase, Mail, Lock, User, Users, Eye, EyeOff, Building, Globe, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { authAPI, tokenManager } from "@/utils/api";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    // Client specific fields
    companyName: "",
    industry: "",
    website: "",
    bio: "",
    location: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleSelect = (role: string) => {
    setFormData({ ...formData, role });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (!formData.role) {
      toast({
        title: "Error",
        description: "Please select your role",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      let response;
      
      if (formData.role === "client") {
        const clientData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          companyName: formData.companyName,
          industry: formData.industry,
          website: formData.website,
          bio: formData.bio,
          location: formData.location
        };
        response = await authAPI.clientSignup(clientData);
      } else {
        const freelancerData = {
          name: formData.name,
          email: formData.email,
          password: formData.password
        };
        response = await authAPI.freelancerSignup(freelancerData);
      }

      if (response.success) {
        // Store token and user data
        tokenManager.setToken(response.data.token);
        tokenManager.setUserRole(response.data.user.role);
        tokenManager.setUserData(response.data.user);

        toast({
          title: "Account created successfully!",
          description: response.message,
        });
        
        // Navigate to profile setup based on role
        if (formData.role === "client") {
          navigate("/client-profile-setup");
        } else {
          navigate("/freelancer-profile-setup");
        }
      } else {
        toast({
          title: "Signup Failed",
          description: response.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup Failed",
        description: "An error occurred during signup. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-slate-600 bg-clip-text text-transparent">
              FreelanceHub
            </h1>
          </Link>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-800">Join FreelanceHub</CardTitle>
            <p className="text-gray-600">Create your account to get started</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              {/* Role Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">I want to:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleRoleSelect("client")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.role === "client"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Users className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Hire Talent</div>
                    <div className="text-xs text-gray-500">I'm a client</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleRoleSelect("freelancer")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.role === "freelancer"
                        ? "border-slate-600 bg-slate-50 text-slate-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Briefcase className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Find Work</div>
                    <div className="text-xs text-gray-500">I'm a freelancer</div>
                  </button>
                </div>
              </div>

              {/* Client-specific fields */}
              {formData.role === "client" && (
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-medium text-gray-800">Company Information</h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Company Name</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        type="text"
                        name="companyName"
                        placeholder="Your company name"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Industry</label>
                    <Input
                      type="text"
                      name="industry"
                      placeholder="e.g., Technology, Healthcare, Finance"
                      value={formData.industry}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Website</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        type="url"
                        name="website"
                        placeholder="https://yourcompany.com"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        type="text"
                        name="location"
                        placeholder="City, Country"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Company Bio</label>
                    <Textarea
                      name="bio"
                      placeholder="Tell us about your company..."
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      required
                    />
                  </div>
                </div>
              )}
              
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{" "}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-slate-600 hover:from-blue-700 hover:to-slate-700 py-3"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
            
            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
