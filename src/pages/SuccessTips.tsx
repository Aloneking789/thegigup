import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, TrendingUp, MessageSquare, Timer, Clock, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MobileNav from "@/components/MobileNav";

const SuccessTips = () => {
  const tips = [
    {
      icon: <TrendingUp className="w-10 h-10 text-blue-600" />,
      title: "Stand Out in a Competitive Market",
      description: "Differentiate yourself by highlighting your unique skills and experience. Develop a niche that sets you apart from other freelancers.",
      tags: ["Branding", "Positioning"]
    },
    {
      icon: <MessageSquare className="w-10 h-10 text-blue-600" />,
      title: "Master Client Communication",
      description: "Respond promptly to messages, set clear expectations, and provide regular updates. Good communication builds trust and leads to repeat business.",
      tags: ["Communication", "Client Management"]
    },
    {
      icon: <Timer className="w-10 h-10 text-blue-600" />,
      title: "Manage Your Time Effectively",
      description: "Use time tracking tools, set realistic deadlines, and break large projects into manageable tasks to maintain productivity.",
      tags: ["Time Management", "Productivity"]
    },
    {
      icon: <DollarSign className="w-10 h-10 text-blue-600" />,
      title: "Price Your Services Strategically",
      description: "Research market rates, consider your expertise, and price your services to reflect the value you provide rather than competing solely on price.",
      tags: ["Pricing", "Business Strategy"]
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Success Tips for Freelancers</h1>
            <p className="text-xl text-gray-600">
              Expert advice to help you thrive in your freelance career
            </p>
          </div>

          <div className="space-y-8 mb-12">
            {tips.map((tip, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mx-auto md:mx-0">
                      {tip.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold mb-2 text-center md:text-left">{tip.title}</h2>
                      <p className="text-gray-600 mb-4 text-center md:text-left">{tip.description}</p>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {tip.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 mb-12">
            <h2 className="text-2xl font-semibold mb-6">Daily Habits of Successful Freelancers</h2>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Establish a routine</h3>
                  <p className="text-gray-600">Set consistent working hours to help you stay disciplined and maintain work-life balance.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Prioritize tasks daily</h3>
                  <p className="text-gray-600">Start each day by identifying your most important tasks and tackle them when your energy is highest.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Continuous learning</h3>
                  <p className="text-gray-600">Dedicate time to learning new skills and staying up-to-date with industry trends.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Network consistently</h3>
                  <p className="text-gray-600">Regularly connect with other professionals, join communities, and engage with potential clients.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-blue-600 rounded-xl p-8 text-white text-center">
            <h2 className="text-2xl font-semibold mb-4">Ready to Apply These Tips?</h2>
            <p className="text-lg opacity-90 mb-6">
              Start building your freelance career on TheGigUp today!
            </p>
            <Button size="lg" variant="secondary">
              Create Your Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Footer (Common) */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">TheGigUp</span>
              </div>
              <p className="text-gray-400">Connecting talented freelancers with amazing projects worldwide.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Clients</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/signup?type=client" className="hover:text-white transition-colors">
                    Join as Client
                  </Link>
                </li>
                <li>
                  <Link to="/find-talent" className="hover:text-white transition-colors">
                    Browse Talent
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Freelancers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/signup?type=freelancer" className="hover:text-white transition-colors">
                    Join as Freelancer
                  </Link>
                </li>
                <li>
                  <Link to="/find-work" className="hover:text-white transition-colors">
                    Browse Jobs
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    About TheGigUp
                  </Link>
                </li>
                <li>
                  <Link to="/how-to-find-work" className="hover:text-white transition-colors">
                    How to Find Work
                  </Link>
                </li>
                <li>
                  <Link to="/skill-development" className="hover:text-white transition-colors">
                    Skill Development
                  </Link>
                </li>
                <li>
                  <Link to="/success-stories" className="hover:text-white transition-colors">
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/press" className="hover:text-white transition-colors">
                    Press & News
                  </Link>
                </li>
                <li>
                  <Link to="/contact-support" className="hover:text-white transition-colors">
                    Contact Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TheGigUp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SuccessTips;
