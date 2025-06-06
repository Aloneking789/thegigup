
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Briefcase,
  Settings,
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Camera,
  Star,
  Calendar,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Profile = () => {
  const [userType] = useState("freelancer"); // This would come from auth context

  const freelancerData = {
    name: "Sarah Johnson",
    title: "Full Stack Developer",
    email: "sarah.johnson@email.com",
    phone: "+91 9876543210",
    location: "Mumbai, India",
    avatar: "/placeholder.svg",
    bio: "Experienced full-stack developer with 5+ years in building scalable web applications. Passionate about clean code and user experience.",
    skills: ["React", "Node.js", "Python", "TypeScript", "MongoDB"],
    rating: 4.9,
    reviews: 127,
    completedProjects: 45,
    totalEarnings: "₹5,45,000",
    joinDate: "January 2020"
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
              <Link to="/" className="text-xl font-bold text-gray-900">FreelanceHub</Link>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/find-talent" className="text-gray-600 hover:text-blue-600">Find Talent</Link>
              <Link to="/find-work" className="text-gray-600 hover:text-blue-600">Find Work</Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-600">About</Link>
              <Link to="/profile" className="text-blue-600 font-medium">Profile</Link>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="bg-white border-gray-200 mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={freelancerData.avatar} />
                  <AvatarFallback className="text-2xl">
                    {freelancerData.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0">
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{freelancerData.name}</h1>
                  <p className="text-xl text-blue-600 font-medium">{freelancerData.title}</p>
                  <div className="flex items-center mt-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">{freelancerData.rating}</span>
                    <span className="text-gray-500 ml-1">({freelancerData.reviews} reviews)</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {freelancerData.email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {freelancerData.phone}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {freelancerData.location}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
                  <Briefcase className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{freelancerData.completedProjects}</div>
                  <p className="text-xs text-gray-600">Successfully delivered</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <Award className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{freelancerData.totalEarnings}</div>
                  <p className="text-xs text-gray-600">Lifetime earnings</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                  <Calendar className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{freelancerData.joinDate}</div>
                  <p className="text-xs text-gray-600">Join date</p>
                </CardContent>
              </Card>
            </div>

            {/* Bio and Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{freelancerData.bio}</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {freelancerData.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="portfolio">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle>Portfolio Projects</CardTitle>
                <CardDescription>Showcase your best work</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Portfolio Items Yet</h3>
                  <p className="text-gray-600 mb-6">Add your best work to showcase your skills</p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Add Portfolio Item
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle>Client Reviews</CardTitle>
                <CardDescription>What clients say about your work</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-600">Complete your first project to start receiving reviews</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <User className="w-4 h-4 mr-2" />
                    Edit Personal Information
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Preferences
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Notification Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
