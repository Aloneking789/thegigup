import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, CheckCircle, UserPlus, Search, FileText, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";

const GetStarted = () => {
  const steps = [
    {
      icon: <UserPlus className="w-10 h-10 text-blue-600" />,
      title: "Create Your Account",
      description: "Sign up with your email and set up your profile with accurate information about your skills and experience."
    },
    {
      icon: <FileText className="w-10 h-10 text-blue-600" />,
      title: "Complete Your Profile",
      description: "Add a professional profile photo, write a compelling bio, and list your key skills to stand out to potential clients."
    },
    {
      icon: <Search className="w-10 h-10 text-blue-600" />,
      title: "Find Relevant Jobs",
      description: "Browse job listings that match your skills and experience level. Use filters to narrow down your search."
    },
    {
      icon: <Award className="w-10 h-10 text-blue-600" />,
      title: "Submit Quality Proposals",
      description: "Write personalized proposals that highlight your relevant experience and explain why you're the perfect fit for the project."
    }
  ];

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
            </div>
            
            <MobileNav 
              userLoggedIn={false}
              userRole={null}
              userProfile={null}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">How to Get Started</h1>
            <p className="text-xl text-gray-600">
              Your step-by-step guide to starting your freelance journey on TheGigUp
            </p>
          </div>

          <div className="space-y-12 mb-12">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  {step.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-2 text-center md:text-left">
                    Step {index + 1}: {step.title}
                  </h2>
                  <p className="text-gray-600 text-lg text-center md:text-left">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <Card className="bg-white mb-12">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Pro Tips for Success</h2>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Make your profile stand out</h3>
                    <p className="text-gray-600">Use a professional photo, write a compelling bio, and showcase your best work samples.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Personalize your proposals</h3>
                    <p className="text-gray-600">Address the client's specific needs and explain how your skills and experience make you the perfect candidate.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Communicate professionally</h3>
                    <p className="text-gray-600">Respond promptly to messages, be clear in your communication, and maintain professionalism in all interactions.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Deliver quality work on time</h3>
                    <p className="text-gray-600">Meet deadlines, deliver high-quality work, and exceed client expectations to earn positive reviews.</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="bg-blue-600 rounded-xl p-8 text-white text-center">
            <h2 className="text-2xl font-semibold mb-4">Ready to Begin Your Freelance Journey?</h2>
            <p className="text-lg opacity-90 mb-6">
              Join thousands of successful freelancers on TheGigUp today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Create Your Profile
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Browse Available Jobs
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer (Common) */}
      <Footer />

 

    </div>
  );
};

export default GetStarted;
