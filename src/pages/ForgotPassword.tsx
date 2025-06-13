import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Briefcase, Mail, Lock, Users, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { API_CONFIG, getApiUrl } from "@/lib/config/api";

type Step = 'role' | 'email' | 'otp';

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState<Step>('role');
  const [formData, setFormData] = useState({
    role: "",
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });
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
    setCurrentStep('email');
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = formData.role === "client" 
        ? API_CONFIG.ENDPOINTS.CLIENT.FORGOT_PASSWORD 
        : API_CONFIG.ENDPOINTS.FREELANCER.FORGOT_PASSWORD;
      
      const apiUrl = getApiUrl(endpoint);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "OTP Sent!",
          description: "Please check your email for the OTP code.",
        });
        setCurrentStep('otp');
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to send OTP. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      toast({
        title: "Network error",
        description: "Unable to connect to the server. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = formData.role === "client" 
        ? API_CONFIG.ENDPOINTS.CLIENT.VERIFY_OTP 
        : API_CONFIG.ENDPOINTS.FREELANCER.VERIFY_OTP;
      
      const apiUrl = getApiUrl(endpoint);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Password Reset Successful!",
          description: "Your password has been updated. You can now log in with your new password.",
        });
        navigate("/login");
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to reset password. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      toast({
        title: "Network error",
        description: "Unable to connect to the server. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Select Your Account Type</h2>
        <p className="text-gray-600">Choose whether you are a client or freelancer</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => handleRoleSelect("client")}
          className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
        >
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-blue-600" />
            <div>
              <div className="font-medium text-gray-900">Client</div>
              <div className="text-sm text-gray-600">I hire freelancers for projects</div>
            </div>
          </div>
        </button>
        
        <button
          onClick={() => handleRoleSelect("freelancer")}
          className="p-4 rounded-lg border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all text-left"
        >
          <div className="flex items-center space-x-3">
            <Briefcase className="w-6 h-6 text-purple-600" />
            <div>
              <div className="font-medium text-gray-900">Freelancer</div>
              <div className="text-sm text-gray-600">I offer services to clients</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );

  const renderEmailForm = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Enter Your Email</h2>
        <p className="text-gray-600">We'll send you an OTP to reset your password</p>
      </div>
      
      <form onSubmit={handleSendOTP} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              className="pl-10 border-gray-200 focus:border-blue-500"
              required
            />
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep('role')}
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send OTP"}
          </Button>
        </div>
      </form>
    </div>
  );

  const renderOTPForm = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Verify OTP & Set New Password</h2>
        <p className="text-gray-600">Enter the OTP sent to {formData.email}</p>
      </div>
      
      <form onSubmit={handleVerifyOTP} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">OTP Code</label>
          <Input
            type="text"
            name="otp"
            placeholder="Enter 6-digit OTP"
            value={formData.otp}
            onChange={handleInputChange}
            className="text-center tracking-widest text-lg"
            maxLength={6}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="pl-10 border-gray-200 focus:border-blue-500"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="pl-10 border-gray-200 focus:border-blue-500"
              required
            />
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep('email')}
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </div>
      </form>
      
      <div className="text-center">
        <button
          onClick={handleSendOTP}
          className="text-sm text-blue-600 hover:text-blue-500"
          disabled={isLoading}
        >
          Didn't receive OTP? Resend
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">TheGigUp</h1>
          </Link>
        </div>

        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">Reset Password</CardTitle>
            <p className="text-gray-600">Follow the steps to reset your password</p>
          </CardHeader>
          
          <CardContent>
            {currentStep === 'role' && renderRoleSelection()}
            {currentStep === 'email' && renderEmailForm()}
            {currentStep === 'otp' && renderOTPForm()}
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Remember your password?{" "}
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

export default ForgotPassword;