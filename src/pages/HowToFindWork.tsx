import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Filter, 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Users, 
  TrendingUp,
  BookOpen,
  Lightbulb,
  Target,
  CheckCircle,
  ArrowRight,
  Heart,
  Award,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MobileNav from "@/components/MobileNav";
import { isLoggedIn, RoleStorage } from "@/lib/config/api";
import Footer from "@/components/Footer";

const HowToFindWork = () => {
  const [userLoggedIn] = useState(isLoggedIn());
  const [userRole] = useState(RoleStorage.getRole() as 'CLIENT' | 'FREELANCER' | null);
  const [searchQuery, setSearchQuery] = useState("");

  const steps = [
    {
      step: 1,
      title: "Create Your Profile",
      description: "Build a compelling profile that showcases your skills and experience",
      icon: Users,
      tips: [
        "Use a professional profile photo",
        "Write a clear, compelling headline",
        "Highlight your top skills and experience",
        "Include portfolio samples or previous work",
        "Add relevant certifications and education"
      ],
      timeEstimate: "30-60 minutes"
    },
    {
      step: 2,
      title: "Define Your Services",
      description: "Clearly outline what you offer and your pricing structure",
      icon: Target,
      tips: [
        "List specific services you provide",
        "Set competitive but fair rates",
        "Define your availability and working hours",
        "Specify your preferred project types",
        "Outline your process and deliverables"
      ],
      timeEstimate: "45 minutes"
    },
    {
      step: 3,
      title: "Search for Projects",
      description: "Use our platform to find projects that match your skills",
      icon: Search,
      tips: [
        "Use relevant keywords in your search",
        "Set up project alerts for your skills",
        "Filter by budget, timeline, and project type",
        "Check project details and requirements carefully",
        "Look for clients with good ratings and reviews"
      ],
      timeEstimate: "Ongoing"
    },
    {
      step: 4,
      title: "Write Winning Proposals",
      description: "Craft proposals that stand out and win you projects",
      icon: BookOpen,
      tips: [
        "Address the client's specific needs",
        "Showcase relevant experience and results",
        "Provide a clear project timeline",
        "Include samples of similar work",
        "Ask thoughtful questions about the project"
      ],
      timeEstimate: "15-30 minutes per proposal"
    },
    {
      step: 5,
      title: "Deliver Exceptional Work",
      description: "Exceed client expectations to build long-term relationships",
      icon: Award,
      tips: [
        "Communicate regularly with updates",
        "Meet all deadlines as promised",
        "Go above and beyond when possible",
        "Be responsive to feedback and revisions",
        "Deliver work that exceeds expectations"
      ],
      timeEstimate: "Project dependent"
    },
    {
      step: 6,
      title: "Build Your Reputation",
      description: "Gather reviews and referrals to grow your freelance business",
      icon: TrendingUp,
      tips: [
        "Ask satisfied clients for reviews",
        "Request referrals and testimonials",
        "Maintain relationships with past clients",
        "Continuously improve your skills",
        "Build a portfolio of successful projects"
      ],
      timeEstimate: "Ongoing"
    }
  ];

  const jobCategories = [
    {
      category: "Web Development",
      icon: "💻",
      avgRate: "$50-120/hr",
      demand: "High",
      skills: ["React", "Node.js", "Python", "JavaScript", "TypeScript"],
      description: "Build websites, web applications, and digital platforms"
    },
    {
      category: "Design & Creative",
      icon: "🎨",
      avgRate: "$40-100/hr",
      demand: "High",
      skills: ["UI/UX Design", "Graphic Design", "Adobe Creative Suite", "Figma", "Branding"],
      description: "Create visual designs, user interfaces, and brand materials"
    },
    {
      category: "Content & Writing",
      icon: "✍️",
      avgRate: "$25-80/hr",
      demand: "Medium-High",
      skills: ["Content Writing", "Copywriting", "SEO", "Blog Writing", "Technical Writing"],
      description: "Produce written content for websites, marketing, and documentation"
    },
    {
      category: "Digital Marketing",
      icon: "📈",
      avgRate: "$35-90/hr",
      demand: "High",
      skills: ["Google Ads", "Social Media", "SEO", "Email Marketing", "Analytics"],
      description: "Promote businesses online and drive digital growth"
    },
    {
      category: "Data & Analytics",
      icon: "📊",
      avgRate: "$45-110/hr",
      demand: "Very High",
      skills: ["Python", "SQL", "Tableau", "Excel", "Machine Learning"],
      description: "Analyze data and provide business insights"
    },
    {
      category: "Mobile Development",
      icon: "📱",
      avgRate: "$55-130/hr",
      demand: "High",
      skills: ["React Native", "Flutter", "iOS", "Android", "Swift"],
      description: "Develop mobile applications for iOS and Android"
    }
  ];

  const tips = [
    {
      category: "Profile Optimization",
      icon: Users,
      color: "bg-blue-500",
      tips: [
        "Use keywords relevant to your field in your profile",
        "Update your profile regularly with new skills and projects",
        "Include specific achievements and metrics",
        "Get skills verified by completing tests or certifications"
      ]
    },
    {
      category: "Proposal Writing",
      icon: BookOpen,
      color: "bg-green-500",
      tips: [
        "Read the project description thoroughly before responding",
        "Customize each proposal for the specific project",
        "Include relevant work samples or case studies",
        "Mention specific tools or technologies you'll use"
      ]
    },
    {
      category: "Pricing Strategy",
      icon: DollarSign,
      color: "bg-purple-500",
      tips: [
        "Research market rates for your skills and experience level",
        "Start competitive but increase rates as you gain reviews",
        "Consider value-based pricing for complex projects",
        "Be transparent about additional costs or revisions"
      ]
    },
    {
      category: "Client Communication",
      icon: Heart,
      color: "bg-orange-500",
      tips: [
        "Respond to messages within 24 hours",
        "Set clear expectations about timelines and deliverables",
        "Provide regular project updates and progress reports",
        "Be professional but personable in all communications"
      ]
    }
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // In a real app, this would navigate to the find work page with the search query
      window.location.href = `/find-work?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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

            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                About
              </Link>
              {userLoggedIn ? (
                <>
                  {userRole === 'CLIENT' ? (
                    <>
                      <Link to="/find-talent" className="text-gray-600 hover:text-blue-600 transition-colors">
                        Find Talent
                      </Link>
                      <Link to="/client-dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                        Dashboard
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/find-work" className="text-gray-600 hover:text-blue-600 transition-colors">
                        Find Work
                      </Link>
                      <Link to="/freelancer-dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                        Dashboard
                      </Link>
                    </>
                  )}
                  <Link to="/profile" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/find-talent" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Find Talent
                  </Link>
                  <Link to="/find-work" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Find Work
                  </Link>
                  <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Log In
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-blue-600 hover:bg-blue-700">Sign Up</Button>
                  </Link>
                </>
              )}
            </nav>

            <MobileNav 
              userLoggedIn={userLoggedIn}
              userRole={userRole}
              userProfile={null}
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <Briefcase className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            How to Find Work
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Your complete guide to landing your first project and building a successful freelance career on TheGigUp
          </p>
          
          {/* Quick Search */}
          <div className="max-w-lg mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search for work opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-12 h-14 text-lg bg-white/10 backdrop-blur border-white/20 text-white placeholder-white/70 focus:bg-white/20"
              />
              <Button 
                onClick={handleSearch}
                className="absolute right-2 top-2 h-10 bg-white text-blue-600 hover:bg-gray-100"
              >
                Search
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Zap className="w-5 h-5 mr-2" />
              Start Finding Work
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Watch Tutorial
            </Button>
          </div>
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Step-by-Step Guide
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Follow these proven steps to start finding and winning projects
            </p>
          </div>

          <div className="space-y-12">
            {steps.map((step) => {
              const IconComponent = step.icon;
              const isEven = step.step % 2 === 0;
              
              return (
                <div key={step.step} className={`flex items-center ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                  <div className={`w-full lg:w-1/2 ${isEven ? 'lg:pl-12' : 'lg:pr-12'} mb-8 lg:mb-0`}>
                    <Card className="hover:shadow-xl transition-shadow duration-300 h-full">
                      <CardHeader>
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
                            <span className="text-white font-bold">{step.step}</span>
                          </div>
                          <div>
                            <CardTitle className="text-xl">{step.title}</CardTitle>
                            <CardDescription className="text-gray-600">
                              Estimated time: {step.timeEstimate}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-6">{step.description}</p>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Key Tips:</h4>
                          <ul className="space-y-2">
                            {step.tips.map((tip, index) => (
                              <li key={index} className="flex items-start text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className={`w-full lg:w-1/2 ${isEven ? 'lg:pr-12' : 'lg:pl-12'}`}>
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <IconComponent className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Job Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore high-demand categories where you can find great opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{category.icon}</div>
                    <div>
                      <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                        {category.category}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary">{category.avgRate}</Badge>
                        <Badge 
                          className={`${
                            category.demand === 'Very High' ? 'bg-red-100 text-red-800' :
                            category.demand === 'High' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {category.demand} Demand
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div>
                    <h4 className="font-medium mb-2">Key Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4 group-hover:bg-blue-50 group-hover:border-blue-200">
                    Explore Jobs
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pro Tips */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pro Tips for Success
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learn from experienced freelancers who've built successful careers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tips.map((tipCategory, index) => {
              const IconComponent = tipCategory.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${tipCategory.color} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle className="text-xl">{tipCategory.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {tipCategory.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start text-sm text-gray-600">
                          <Lightbulb className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Freelance Journey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of freelancers who've found success on our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Create Your Profile
            </Button>
            <Button size="lg" variant="outline" className="border-white text-blue-600 hover:bg-white hover:text-blue-600">
              Browse Available Jobs
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default HowToFindWork;
