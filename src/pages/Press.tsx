import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, Newspaper, Calendar, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MobileNav from "@/components/MobileNav";

const Press = () => {
  const pressReleases = [

    {
      title: "TheGigUp Launches New AI-Powered Matching System",
      date: "May 15, 2025",
      outlet: "Internet",
      summary: "The new AI system helps match freelancers with projects that best fit their skills and experience, improving success rates by 35%."
    },
    {
      title: "TheGigUp Reports 200% Growth in Freelancer Signups",
      date: "April 22, 2025",
      outlet: "Internet",
      summary: "The platform has seen unprecedented growth in both client projects and freelancer registrations during the first quarter of 2025."
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Press & News</h1>
            <p className="text-xl text-gray-600">
              Stay updated with the latest news and announcements from TheGigUp
            </p>
          </div>

          <div className="space-y-8 mb-12">
            <h2 className="text-2xl font-semibold mb-6">Latest Press Releases</h2>
            
            {pressReleases.map((release, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>{release.outlet}</Badge>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" /> {release.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{release.title}</h3>
                  <p className="text-gray-600 mb-3">{release.summary}</p>
                  <Link to="#" className="text-blue-600 hover:text-blue-800 flex items-center">
                    Read full article <ExternalLink className="w-4 h-4 ml-1" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 mb-12">
            <h2 className="text-2xl font-semibold mb-6">Media Inquiries</h2>
            <p className="text-gray-600 mb-4">
              For press inquiries, interview requests, or additional information about TheGigUp, please contact our media relations team.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">Press Contact:</p>
              <p className="text-gray-600">press@thegigup.com</p>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
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

export default Press;
