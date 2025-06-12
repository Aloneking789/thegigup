import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Trophy, 
  Users, 
  Star, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Play,
  Download,
  Globe,
  Code,
  Palette,
  PenTool,
  BarChart3,
  Camera,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MobileNav from "@/components/MobileNav";
import { isLoggedIn, RoleStorage } from "@/lib/config/api";

const SkillDevelopment = () => {
  const [userLoggedIn] = useState(isLoggedIn());
  const [userRole] = useState(RoleStorage.getRole() as 'CLIENT' | 'FREELANCER' | null);

  const skillCategories = [
    {
      id: "development",
      name: "Web Development",
      icon: Code,
      color: "bg-blue-500",
      courses: 15,
      description: "Learn modern web development technologies"
    },
    {
      id: "design",
      name: "UI/UX Design",
      icon: Palette,
      color: "bg-purple-500",
      courses: 12,
      description: "Master design principles and tools"
    },
    {
      id: "writing",
      name: "Content Writing",
      icon: PenTool,
      color: "bg-green-500",
      courses: 8,
      description: "Improve your writing and copywriting skills"
    },
    {
      id: "marketing",
      name: "Digital Marketing",
      icon: BarChart3,
      color: "bg-orange-500",
      courses: 10,
      description: "Learn marketing strategies and analytics"
    },
    {
      id: "photography",
      name: "Photography",
      icon: Camera,
      color: "bg-pink-500",
      courses: 6,
      description: "Master photography and photo editing"
    },
    {
      id: "business",
      name: "Business Skills",
      icon: Briefcase,
      color: "bg-indigo-500",
      courses: 9,
      description: "Develop entrepreneurial and business skills"
    }
  ];

  const featuredCourses = [
    {
      id: 1,
      title: "Complete React Developer Course",
      instructor: "Sarah Johnson",
      instructorImage: null,
      category: "Web Development",
      duration: "12 hours",
      lessons: 48,
      students: 2847,
      rating: 4.8,
      reviews: 324,
      price: "Free",
      level: "Beginner to Advanced",
      description: "Master React from basics to advanced concepts including hooks, context, and modern patterns.",
      skills: ["React", "JavaScript", "HTML", "CSS", "Hooks"],
      isFeatured: true
    },
    {
      id: 2,
      title: "UI/UX Design Fundamentals",
      instructor: "Michael Chen",
      instructorImage: null,
      category: "Design",
      duration: "8 hours",
      lessons: 32,
      students: 1923,
      rating: 4.9,
      reviews: 187,
      price: "Free",
      level: "Beginner",
      description: "Learn the principles of user interface and user experience design.",
      skills: ["Figma", "Design Thinking", "Prototyping", "User Research"],
      isFeatured: true
    },
    {
      id: 3,
      title: "Content Marketing Mastery",
      instructor: "Emma Rodriguez",
      instructorImage: null,
      category: "Marketing",
      duration: "6 hours",
      lessons: 24,
      students: 1456,
      rating: 4.7,
      reviews: 132,
      price: "Free",
      level: "Intermediate",
      description: "Create compelling content that drives engagement and conversions.",
      skills: ["Content Strategy", "SEO", "Social Media", "Analytics"],
      isFeatured: true
    }
  ];

  const learningPaths = [
    {
      id: 1,
      title: "Full-Stack Developer",
      description: "Become a complete web developer with front-end and back-end skills",
      duration: "3-6 months",
      courses: 8,
      skills: ["React", "Node.js", "MongoDB", "Express", "TypeScript"],
      difficulty: "Intermediate",
      outcomes: [
        "Build complete web applications",
        "Work with databases",
        "Deploy applications to production",
        "Understand modern development workflows"
      ]
    },
    {
      id: 2,
      title: "Digital Marketing Expert",
      description: "Master all aspects of digital marketing from strategy to execution",
      duration: "2-4 months",
      courses: 6,
      skills: ["SEO", "Google Ads", "Social Media", "Analytics", "Content Marketing"],
      difficulty: "Beginner",
      outcomes: [
        "Create effective marketing campaigns",
        "Analyze marketing performance",
        "Manage social media presence",
        "Optimize for search engines"
      ]
    },
    {
      id: 3,
      title: "UX/UI Designer",
      description: "Design beautiful and functional user experiences",
      duration: "2-3 months",
      courses: 5,
      skills: ["Figma", "Adobe XD", "User Research", "Prototyping", "Design Systems"],
      difficulty: "Beginner",
      outcomes: [
        "Design user-centered interfaces",
        "Conduct user research",
        "Create interactive prototypes",
        "Build design systems"
      ]
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
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Develop Your Skills
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Enhance your expertise with our comprehensive learning resources and stay ahead in the competitive freelance market
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Play className="w-5 h-5 mr-2" />
              Start Learning
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Download className="w-5 h-5 mr-2" />
              Download Resources
            </Button>
          </div>
        </div>
      </section>

      {/* Skill Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Skill Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our wide range of skill categories to find the perfect learning path for your career goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skillCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card key={category.id} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{category.name}</CardTitle>
                        <CardDescription>{category.courses} courses available</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <Button variant="outline" className="w-full group-hover:bg-blue-50 group-hover:border-blue-200">
                      Explore Courses
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Learning Paths
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Follow structured learning paths designed to take you from beginner to expert in your chosen field
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {learningPaths.map((path) => (
              <Card key={path.id} className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{path.difficulty}</Badge>
                    <span className="text-sm text-gray-500">{path.duration}</span>
                  </div>
                  <CardTitle className="text-xl mb-2">{path.title}</CardTitle>
                  <CardDescription>{path.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{path.courses} courses</span>
                    <span>{path.skills.length} skills</span>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Skills you'll learn:</h4>
                    <div className="flex flex-wrap gap-2">
                      {path.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Learning outcomes:</h4>
                    <ul className="space-y-1">
                      {path.outcomes.slice(0, 2).map((outcome, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Start Learning Path
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Courses
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start with these popular courses recommended by our community
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-blue-100 text-blue-800">{course.category}</Badge>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {course.price}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={course.instructorImage || undefined} />
                      <AvatarFallback>
                        {course.instructor.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{course.instructor}</p>
                      <p className="text-xs text-gray-500">Instructor</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      {course.lessons} lessons
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      {course.students.toLocaleString()} students
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-2 text-yellow-400 fill-current" />
                      {course.rating} ({course.reviews})
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Skills covered:</p>
                    <div className="flex flex-wrap gap-2">
                      {course.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Play className="w-4 h-4 mr-2" />
                    Start Course
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Additional Resources
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore more ways to enhance your skills and grow your freelance career
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Globe className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Online Workshops</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Join live workshops with industry experts
                </p>
                <Button variant="outline" className="w-full">
                  View Schedule
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle>E-books & Guides</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Download comprehensive guides and resources
                </p>
                <Button variant="outline" className="w-full">
                  Browse Library
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Community Forums</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Connect with other learners and experts
                </p>
                <Button variant="outline" className="w-full">
                  Join Community
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Trophy className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Earn certificates to showcase your skills
                </p>
                <Button variant="outline" className="w-full">
                  Get Certified
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Level Up Your Skills?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of freelancers who have advanced their careers through continuous learning
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Your Journey
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Browse All Courses
            </Button> */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">TheGigUp</span>
              </div>
              <p className="text-gray-400">
                Empowering freelancers with the skills and opportunities to succeed in the digital economy.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Learning</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/skill-development" className="hover:text-white transition-colors">Skill Development</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Courses</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Workshops</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Certifications</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/success-stories" className="hover:text-white transition-colors">Success Stories</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Forums</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Events</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TheGigUp. All rights reserved. Built with ❤️ for the freelance community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SkillDevelopment;
