import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, MailOpen, Phone, MessageSquare, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MobileNav from "@/components/MobileNav";

const ContactSupport = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (value: string) => {
    setForm({
      ...form,
      category: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Support</h1>
            <p className="text-xl text-gray-600">
              Get help with your account, projects, or any questions you have
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MailOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Email Support</h3>
                <p className="text-gray-600 mb-4">
                  Get a response within 24 hours
                </p>
                <a href="mailto:support@thegigup.com" className="text-blue-600 hover:text-blue-800">
                  support@thegigup.com
                </a>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Phone Support</h3>
                <p className="text-gray-600 mb-4">
                  Available Mon-Fri, 9am-5pm
                </p>
                <a href="tel:+15551234567" className="text-blue-600 hover:text-blue-800">
                  +1 (555) 123-4567
                </a>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-4">
                  Get immediate help from our team
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white mb-12">
            <CardHeader>
              <CardTitle>Submit a Support Request</CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Request Submitted!</h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for contacting us. We'll get back to you as soon as possible.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setSubmitted(false)}
                    className="mr-2"
                  >
                    Submit Another Request
                  </Button>
                  <Button asChild>
                    <Link to="/">Return to Homepage</Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label 
                        htmlFor="name" 
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name
                      </label>
                      <Input 
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label 
                        htmlFor="email" 
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="your-email@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label 
                      htmlFor="category" 
                      className="block text-sm font-medium text-gray-700"
                    >
                      Category
                    </label>
                    <Select 
                      value={form.category} 
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="account">Account Issues</SelectItem>
                        <SelectItem value="payment">Payment Problems</SelectItem>
                        <SelectItem value="project">Project Concerns</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label 
                      htmlFor="subject" 
                      className="block text-sm font-medium text-gray-700"
                    >
                      Subject
                    </label>
                    <Input 
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      placeholder="Brief summary of your issue"
                    />
                  </div>

                  <div className="space-y-2">
                    <label 
                      htmlFor="message" 
                      className="block text-sm font-medium text-gray-700"
                    >
                      Message
                    </label>
                    <Textarea 
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Please describe your issue in detail..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Submit Request
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <h2 className="text-xl font-semibold mb-3">Frequently Asked Questions</h2>
            <p className="text-gray-600 mb-4">
              Find answers to common questions in our help center.
            </p>
            <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
              Visit Help Center
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

export default ContactSupport;
