import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Briefcase, Mail, Lock, User, Users, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { API_CONFIG, getApiUrl, setTokenByRole } from "@/lib/config/api";
import SEO from "@/components/SEO";

type Step = 'email-verification' | 'otp-verification' | 'signup-form';

const Signup = () => {
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type');

  const [currentStep, setCurrentStep] = useState<Step>('email-verification');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    otp: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
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

  const handleSendVerificationOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiUrl = getApiUrl('/email/send-verification-otp');

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
          title: "Verification OTP Sent!",
          description: "Please check your email for the verification code.",
        });
        setCurrentStep('otp-verification');
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to send verification OTP. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Send verification OTP error:', error);
      toast({
        title: "Network error",
        description: "Unable to connect to the server. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmailOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiUrl = getApiUrl('/email/verify-otp');

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp
        }),
      });

      const data = await response.json(); if (response.ok) {
        toast({
          title: "Email Verified!",
          description: "Your email has been verified successfully.",
        });
        setIsEmailVerified(true);
        setCurrentStep('signup-form');
      } else {
        toast({
          title: "Verification Failed",
          description: data.message || "Invalid OTP. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Verify email OTP error:', error);
      toast({
        title: "Network error",
        description: "Unable to connect to the server. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEmailVerified) {
      toast({
        title: "Error",
        description: "Please verify your email first",
        variant: "destructive"
      });
      return;
    }

    if (!hasAcceptedTerms) {
      toast({
        title: "Error",
        description: "Please accept the terms and conditions to continue",
        variant: "destructive"
      });
      return;
    }

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

  const renderEmailVerification = () => (
    <div className="space-y-6">
      {/* <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Verify Your Email</h2>
        <p className="text-gray-600">Enter your email to receive a verification code</p>
      </div> */}

      <form onSubmit={handleSendVerificationOTP} className="space-y-4">
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
              className="pl-10"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Verification Code"}
        </Button>
      </form>
    </div>
  );

  const renderOTPVerification = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Enter Verification Code</h2>
        <p className="text-gray-600">We sent a verification code to {formData.email}</p>
      </div>

      <form onSubmit={handleVerifyEmailOTP} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Verification Code</label>
          <Input
            type="text"
            name="otp"
            placeholder="Enter 6-digit code"
            value={formData.otp}
            onChange={handleInputChange}
            className="text-center tracking-widest text-lg"
            maxLength={6}
            required
          />
        </div>

        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep('email-verification')}
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </Button>
        </div>
      </form>

      <div className="text-center">
        <button
          onClick={handleSendVerificationOTP}
          className="text-sm text-blue-600 hover:text-blue-500"
          disabled={isLoading}
        >
          Didn't receive the code? Resend
        </button>      </div>
    </div>
  );

  const renderSignupForm = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-3">
          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
          <span className="text-sm text-green-600 font-medium">Email Verified</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Complete Your Profile</h2>
        <p className="text-gray-600">Fill in your details to create your account</p>
      </div>

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
              value={formData.email}
              className="pl-10 bg-gray-50"
              disabled
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
              className={`p-4 rounded-lg border-2 transition-all ${formData.role === "client"
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
              className={`p-4 rounded-lg border-2 transition-all ${formData.role === "freelancer"
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

        {/* Terms and Conditions Checkbox */}
        <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
          <Checkbox
            id="accept-terms"
            checked={hasAcceptedTerms}
            onCheckedChange={(checked) => setHasAcceptedTerms(checked === true)}
            className="mt-1"
            required
          />
          <label htmlFor="accept-terms" className="text-sm font-medium leading-relaxed cursor-pointer">
            I have read and agree to the{" "}
            <Link to="/terms" target="_blank" className="text-blue-600 hover:text-blue-500 underline">
              Terms and Conditions
            </Link>
            {" "}and <Link to="/privacy" target="_blank" className="text-blue-600 hover:text-blue-500 underline">
              Privacy Policy
            </Link>.
          </label>
        </div>

        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep('otp-verification')}
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={isLoading || !hasAcceptedTerms}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* SEO Meta Tags with canonical URL */}
      <SEO
        title={userType === 'client' ? 'Join TheGigUp as Client - Hire Freelancers' : userType === 'freelancer' ? 'Join TheGigUp as Freelancer - Find Work' : 'Sign Up - TheGigUp Freelance Marketplace'}
        description={userType === 'client' ? 'Join TheGigUp as a client to hire skilled freelancers for your projects. Post jobs and find the perfect talent today.' : userType === 'freelancer' ? 'Join TheGigUp as a freelancer to find exciting projects and clients. Build your career in the gig economy.' : 'Create your TheGigUp account. Join as a client to hire freelancers or as a freelancer to find work.'}
        url="https://www.thegigup.com/signup"
      />

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
          <CardContent>
            {currentStep === 'email-verification' && renderEmailVerification()}
            {currentStep === 'otp-verification' && renderOTPVerification()}
            {currentStep === 'signup-form' && renderSignupForm()}

            <div className="mt-6 text-center">
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