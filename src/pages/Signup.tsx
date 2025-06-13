
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Briefcase, Mail, Lock, User, Users, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { API_CONFIG, getApiUrl, setTokenByRole } from "@/lib/config/api";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setIsLoading(true);    try {
      // Determine the API endpoint based on role
      const endpoint = formData.role === "client" 
        ? API_CONFIG.ENDPOINTS.CLIENT.SIGNUP 
        : API_CONFIG.ENDPOINTS.FREELANCER.SIGNUP;
      
      const apiUrl = getApiUrl(endpoint);
      
      // Prepare signup payload
      const signupData = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      // Parse response data, handle JSON parsing errors gracefully
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse response JSON:', jsonError);
        throw new Error('Invalid server response');
      }

      if (response.ok) {
        // Store token and role in localStorage
        const role = formData.role.toUpperCase() as 'CLIENT' | 'FREELANCER';
        setTokenByRole(role, data.data.token);

        toast({
          title: "Account created successfully!",
          description: "Welcome to TheGigUp",
        });
        
        // Navigate to profile setup based on role
        if (formData.role === "client") {
          navigate("/client-profile-setup");
        } else {
          navigate("/freelancer-profile-setup");
        }
      } else {
        // Enhanced error handling for email already exists scenarios
        let errorMessage = data.message || "An error occurred during signup";
        
        // Check for email already exists scenarios based on status code and message
        if (response.status === 409 || response.status === 400) {
          // HTTP 409 Conflict or 400 Bad Request usually indicates duplicate resource
          if (data.message && (
            data.message.toLowerCase().includes('email already exists') ||
            data.message.toLowerCase().includes('user already exists') ||
            data.message.toLowerCase().includes('already registered')
          )) {
            if (formData.role === "client") {
              errorMessage = "Email address already exists as a freelancer. Can't use same email for a client account.";
            } else {
              errorMessage = "Email address already exists as a client. Can't use same email for a freelancer account.";
            }
          } else {
            errorMessage = data.message || "This email is already registered. Please try a different email.";
          }
        } else if (response.status === 422) {
          // Unprocessable Entity - validation errors
          errorMessage = data.message || "Please check your input and try again.";
        } else {
          // Other errors
          errorMessage = data.message || "Signup failed. Please try again.";
        }

        toast({
          title: "Signup failed",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      
      // More specific error handling
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast({
          title: "Network error",
          description: "Unable to connect to the server. Please check your internet connection and try again.",
          variant: "destructive"
        });
      } else if (error instanceof Error && error.message === 'Invalid server response') {
        toast({
          title: "Server error",
          description: "The server returned an invalid response. Please try again later.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Signup error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TheGigUp
            </h1>
          </Link>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-800">Join TheGigUp</CardTitle>
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
                        ? "border-purple-600 bg-purple-50 text-purple-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Briefcase className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Find Work</div>
                    <div className="text-xs text-gray-500">I'm a freelancer</div>
                  </button>
                </div>
              </div>
              
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
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3"
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
