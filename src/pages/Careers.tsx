import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, Building, Calendar, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MobileNav from "@/components/MobileNav";

const Careers = () => {
  const openPositions = [
    // {
    //   title: "Senior Full-Stack Developer",
    //   department: "Engineering",
    //   location: "Remote",
    //   type: "Full-time",
    //   description: "We're looking for an experienced full-stack developer to help build and maintain our core platform."
    // },
    // {
    //   title: "UX/UI Designer",
    //   department: "Design",
    //   location: "Remote",
    //   type: "Full-time",
    //   description: "Join our design team to create beautiful, intuitive interfaces for our freelancing platform."
    // },
    // {
    //   title: "Customer Success Manager",
    //   department: "Operations",
    //   location: "Remote",
    //   type: "Full-time",
    //   description: "Help our clients and freelancers succeed on our platform through dedicated support and guidance."
    // }
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Team</h1>
            <p className="text-xl text-gray-600">
              Help us build the future of work at TheGigUp
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 mb-12">
            <h2 className="text-2xl font-semibold mb-6">Why Work With Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Remote-First Culture</h3>
                  <p className="text-gray-600">Work from anywhere in the world with our fully distributed team.</p>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Impactful Work</h3>
                  <p className="text-gray-600">Help connect talented freelancers with amazing projects worldwide.</p>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Flexible Schedule</h3>
                  <p className="text-gray-600">Enjoy work-life balance with our flexible working hours.</p>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Competitive Benefits</h3>
                  <p className="text-gray-600">Comprehensive healthcare, retirement plans, and professional development.</p>
                </div>
              </div>
            </div>
          </div>

          {/* <h2 className="text-2xl font-semibold mb-6">Current Openings</h2> */}
          <div className="space-y-6 mb-12">
            {openPositions.map((position, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{position.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary">{position.department}</Badge>
                        <Badge variant="outline">{position.location}</Badge>
                        <Badge variant="outline">{position.type}</Badge>
                      </div>
                      <p className="mt-4 text-gray-600">{position.description}</p>
                    </div>
                    <Button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700">
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Footer (Common) */}
      {/* <footer className="bg-gray-900 text-white py-16">
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
      </footer> */}
    </div>
  );
};

export default Careers;
