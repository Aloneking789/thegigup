import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Trophy, 
  Users, 
  Star, 
  DollarSign, 
  Clock, 
  MapPin, 
  Briefcase,
  TrendingUp,
  Award,
  Quote,
  Calendar,
  ArrowRight,
  Heart,
  Target,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MobileNav from "@/components/MobileNav";
import { isLoggedIn, RoleStorage } from "@/lib/config/api";
import Footer from "@/components/Footer";

const SuccessStories = () => {
  const [userLoggedIn] = useState(isLoggedIn());
  const [userRole] = useState(RoleStorage.getRole() as 'CLIENT' | 'FREELANCER' | null);

  const successStories = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Full-Stack Developer",
      location: "San Francisco, CA",
      profileImage: null,
      beforeTitle: "Junior Developer",
      afterTitle: "Senior Full-Stack Developer",
      timeframe: "18 months",
      incomeIncrease: 180,
      projectsCompleted: 45,
      rating: 4.9,
      reviews: 38,
      story: "I started as a junior developer struggling to find clients. Through TheGigUp's platform and skill development resources, I was able to build a strong portfolio and establish long-term client relationships. Today, I'm earning 3x what I made at my previous job.",
      achievements: [
        "Increased hourly rate from $25 to $95",
        "Built relationships with 12 recurring clients",
        "Completed 45+ successful projects",
        "Achieved 4.9/5 client satisfaction rating"
      ],
      skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
      testimonial: "TheGigUp didn't just give me work opportunities - it gave me the tools and community to transform my entire career trajectory."
    },
    {
      id: 2,
      name: "Marcus Johnson",
      role: "UI/UX Designer",
      location: "Austin, TX",
      profileImage: null,
      beforeTitle: "Graphic Designer",
      afterTitle: "Lead UX Designer",
      timeframe: "2 years",
      incomeIncrease: 220,
      projectsCompleted: 67,
      rating: 4.8,
      reviews: 52,
      story: "Transitioning from print design to digital was challenging. TheGigUp's learning resources and supportive community helped me develop UX skills and land my first digital clients. Now I run a small design agency with 3 team members.",
      achievements: [
        "Launched successful design agency",
        "Worked with Fortune 500 companies",
        "Won 'Designer of the Year' award",
        "Mentored 15+ aspiring designers"
      ],
      skills: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping", "Design Systems"],
      testimonial: "The transition from traditional design to UX seemed impossible until I found the right community and resources on TheGigUp."
    },
    {
      id: 3,
      name: "Priya Sharma",
      role: "Content Marketing Specialist",
      location: "Mumbai, India",
      profileImage: null,
      beforeTitle: "Blog Writer",
      afterTitle: "Content Marketing Strategist",
      timeframe: "14 months",
      incomeIncrease: 150,
      projectsCompleted: 89,
      rating: 4.9,
      reviews: 67,
      story: "I was writing blog posts for $10 each when I joined TheGigUp. Learning about content strategy and digital marketing transformed my approach. Now I help businesses build comprehensive content strategies.",
      achievements: [
        "Increased content rates by 400%",
        "Developed content strategies for 25+ businesses",
        "Built email list of 10,000+ subscribers",
        "Launched successful content marketing course"
      ],
      skills: ["Content Strategy", "SEO", "Email Marketing", "Social Media", "Analytics"],
      testimonial: "TheGigUp taught me that writing isn't just about words - it's about understanding business goals and creating value for clients."
    },
    {
      id: 4,
      name: "Alex Rivera",
      role: "Digital Marketing Consultant",
      location: "Barcelona, Spain",
      profileImage: null,
      beforeTitle: "Social Media Manager",
      afterTitle: "Digital Marketing Consultant",
      timeframe: "2.5 years",
      incomeIncrease: 300,
      projectsCompleted: 156,
      rating: 4.9,
      reviews: 89,
      story: "Starting as a social media manager, I expanded my skills through TheGigUp's resources. Now I provide comprehensive digital marketing consulting to businesses across Europe and North America.",
      achievements: [
        "Generated $2M+ in revenue for clients",
        "Expanded to serve 3 continents",
        "Built team of 8 specialists",
        "Featured in major marketing publications"
      ],
      skills: ["Google Ads", "Facebook Ads", "SEO", "Analytics", "Marketing Automation"],
      testimonial: "TheGigUp gave me the platform to showcase my growing expertise and connect with clients who valued strategic thinking over just task execution."
    }
  ];

  const stats = [
    {
      value: "85%",
      label: "Income Increase",
      description: "Average income increase for active freelancers"
    },
    {
      value: "50K+",
      label: "Success Stories",
      description: "Freelancers who've transformed their careers"
    },
    {
      value: "4.8/5",
      label: "Satisfaction Rate",
      description: "Average client satisfaction rating"
    },
    {
      value: "18 months",
      label: "Average Journey",
      description: "Time to achieve significant growth"
    }
  ];

  const milestones = [
    {
      icon: Target,
      title: "Define Your Goals",
      description: "Set clear career objectives and income targets",
      timeframe: "Week 1"
    },
    {
      icon: Zap,
      title: "Skill Development",
      description: "Enhance your expertise with targeted learning",
      timeframe: "Months 1-3"
    },
    {
      icon: Users,
      title: "Build Your Network",
      description: "Connect with clients and fellow freelancers",
      timeframe: "Months 2-6"
    },
    {
      icon: TrendingUp,
      title: "Scale Your Business",
      description: "Increase rates and expand service offerings",
      timeframe: "Months 6-12"
    },
    {
      icon: Award,
      title: "Achieve Success",
      description: "Reach your goals and help others do the same",
      timeframe: "Year 1+"
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
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <Trophy className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Success Stories
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Discover how freelancers like you have transformed their careers and achieved financial freedom through TheGigUp
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              <Heart className="w-5 h-5 mr-2" />
              Share Your Story
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
              Join Our Community
            </Button> */}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                  <div className="text-xl font-semibold text-gray-900 mb-2">{stat.label}</div>
                  <div className="text-gray-600">{stat.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Inspiring Transformations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from real freelancers who've built successful careers on our platform
            </p>
          </div>

          <div className="space-y-12">
            {successStories.map((story, index) => (
              <Card key={story.id} className="hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Section */}
                    <div className="lg:col-span-1">
                      <div className="text-center">
                        <Avatar className="w-24 h-24 mx-auto mb-4">
                          <AvatarImage src={story.profileImage || undefined} />
                          <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-green-500 text-white">
                            {story.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{story.name}</h3>
                        <p className="text-blue-600 font-medium mb-2">{story.role}</p>
                        <div className="flex items-center justify-center text-gray-600 mb-4">
                          <MapPin className="w-4 h-4 mr-1" />
                          {story.location}
                        </div>
                        
                        <div className="space-y-3">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600">Before</p>
                            <p className="font-medium">{story.beforeTitle}</p>
                          </div>
                          <ArrowRight className="w-6 h-6 text-green-500 mx-auto" />
                          <div className="bg-green-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600">After</p>
                            <p className="font-medium text-green-700">{story.afterTitle}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Story Content */}
                    <div className="lg:col-span-2">
                      <div className="mb-6">
                        <Quote className="w-8 h-8 text-blue-600 mb-4" />
                        <blockquote className="text-lg text-gray-700 italic mb-4">
                          "{story.testimonial}"
                        </blockquote>
                        <p className="text-gray-600 leading-relaxed">
                          {story.story}
                        </p>
                      </div>

                      {/* Achievements */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Key Achievements</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {story.achievements.map((achievement, idx) => (
                            <div key={idx} className="flex items-center text-sm text-gray-600">
                              <Trophy className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                              {achievement}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {story.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 rounded-lg p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">+{story.incomeIncrease}%</div>
                          <div className="text-xs text-gray-600">Income Increase</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{story.projectsCompleted}</div>
                          <div className="text-xs text-gray-600">Projects</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">{story.rating}</div>
                          <div className="text-xs text-gray-600">Rating</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{story.timeframe}</div>
                          <div className="text-xs text-gray-600">Journey</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Journey */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Success Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Follow these proven milestones to build your own success story
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-600 to-green-600 hidden lg:block"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => {
                const IconComponent = milestone.icon;
                const isEven = index % 2 === 0;
                
                return (
                  <div key={index} className={`flex items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    <div className={`w-full lg:w-5/12 ${isEven ? 'lg:pr-8' : 'lg:pl-8'}`}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mr-4">
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{milestone.title}</h3>
                              <p className="text-sm text-blue-600 font-medium">{milestone.timeframe}</p>
                            </div>
                          </div>
                          <p className="text-gray-600">{milestone.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Center circle for timeline */}
                    <div className="hidden lg:block w-2/12 flex justify-center">
                      <div className="w-4 h-4 bg-gradient-to-r from-blue-600 to-green-600 rounded-full border-4 border-white shadow-lg"></div>
                    </div>
                    
                    <div className="hidden lg:block w-5/12"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of freelancers who've transformed their careers and achieved their dreams
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Your Journey
            </Button>
            <Button size="lg" variant="outline" className="border-white text-blue-600 hover:bg-white hover:text-blue-600">
              Learn How to Succeed
            </Button> */}
          </div>
        </div>
      </section>


      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SuccessStories;
