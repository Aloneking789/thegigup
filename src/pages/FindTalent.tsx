import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  MessageSquare,
  Briefcase,
  Users,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  Award,
  Clock,
  Heart,
  Eye,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import MobileNav from "@/components/MobileNav";
import FreelancerContactModal from "@/components/FreelancerContactModal";
import { clientService } from "@/lib/api/client";
import { ClientFreelancer } from "@/lib/api/types";
import { generatePublicProfileUrl } from "@/lib/utils/profileUrl";
import { logout, isLoggedIn, RoleStorage } from "@/lib/config/api";
import { useNavigate } from "react-router-dom";

const FindTalent = () => {
  const [selectedFreelancer, setSelectedFreelancer] = useState<ClientFreelancer | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // API state
  const [freelancers, setFreelancers] = useState<ClientFreelancer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  // User state management
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'CLIENT' | 'FREELANCER' | null>(null);
  const [userProfile, setUserProfile] = useState<{
    name: string;
    email: string;
    profileImage?: string;
  } | null>(null);
    // Search and filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [filters, setFilters] = useState({
    skills: [] as string[],
    location: "",
    minRating: 0,
    maxRate: 5000,
    experienceLevel: "",
    availability: ""
  });

  // Popular skills for filter suggestions
  const popularSkills = [
    "React", "Node.js", "Python", "JavaScript", "TypeScript", "UI/UX Design",
    "Angular", "Vue.js", "PHP", "Java", "C++", "Swift", "Kotlin", "Flutter",
    "React Native", "WordPress", "Shopify", "SEO", "Digital Marketing",
    "Content Writing", "Graphic Design", "Video Editing", "Data Analysis"
  ];  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);  }, [searchQuery]);

  // Initialize user state
  useEffect(() => {
    const loggedIn = isLoggedIn();
    setUserLoggedIn(loggedIn);
    
    if (loggedIn) {
      const role = RoleStorage.getRole();
      setUserRole(role as 'CLIENT' | 'FREELANCER');
      
      // Get user profile data from localStorage or set default
      const storedUserName = localStorage.getItem('userName') || 'User';
      const storedUserEmail = localStorage.getItem('userEmail') || '';
      setUserProfile({
        name: storedUserName,
        email: storedUserEmail,
        profileImage: undefined
      });
    }  }, []);

  // Handle URL search parameter
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);  // Fetch freelancers
  const fetchFreelancers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await clientService.getFreelancers({
        page: pagination.page,
        limit: pagination.limit,
        query: debouncedQuery,
        skills: filters.skills.length > 0 ? filters.skills : undefined,
        location: filters.location || undefined,
        minRating: filters.minRating > 0 ? filters.minRating : undefined,
        maxRate: filters.maxRate < 5000 ? filters.maxRate : undefined,
        experienceLevel: filters.experienceLevel || undefined,
        availability: filters.availability || undefined,
      });      if (response.success) {
        let allFreelancers = [...response.data.freelancers];
        
        // Apply client-side search filtering if there's a search query
        if (debouncedQuery.trim()) {
          allFreelancers = allFreelancers.filter(freelancer => {
            const query = debouncedQuery.toLowerCase();
            
            // Search in name
            const nameMatch = freelancer.user.name.toLowerCase().includes(query);
            
            // Search in skills
            const skillsMatch = freelancer.skills.some(skill => 
              skill.toLowerCase().includes(query)
            );
            
            // Search in experience level
            const experienceMatch = freelancer.experience?.toLowerCase().includes(query);
            
            // Search in bio/description if available
            const bioMatch = freelancer.bio?.toLowerCase().includes(query);
            
            return nameMatch || skillsMatch || experienceMatch || bioMatch;
          });
        }
          // Apply sorting
        switch (sortBy) {
          case 'rating-high':
            allFreelancers.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
            break;
          case 'rating-low':
            allFreelancers.sort((a, b) => (a.ratings || 0) - (b.ratings || 0));
            break;
          case 'rate-high':
            allFreelancers.sort((a, b) => (b.hourlyRate || 0) - (a.hourlyRate || 0));
            break;
          case 'rate-low':
            allFreelancers.sort((a, b) => (a.hourlyRate || 0) - (b.hourlyRate || 0));
            break;
          case 'recent':
            allFreelancers.sort((a, b) => new Date(b.user.createdAt).getTime() - new Date(a.user.createdAt).getTime());
            break;
          case 'relevance':
          default:
            // For relevance, prioritize exact matches and skill matches when there's a search query
            if (debouncedQuery.trim()) {
              allFreelancers.sort((a, b) => {
                const query = debouncedQuery.toLowerCase();
                
                // Exact name matches first
                const aNameExact = a.user.name.toLowerCase() === query ? 2 : 0;
                const bNameExact = b.user.name.toLowerCase() === query ? 2 : 0;
                
                // Partial name matches second
                const aNamePartial = a.user.name.toLowerCase().includes(query) ? 1 : 0;
                const bNamePartial = b.user.name.toLowerCase().includes(query) ? 1 : 0;
                
                // Skill matches
                const aSkillMatch = a.skills.some(skill => skill.toLowerCase().includes(query)) ? 1 : 0;
                const bSkillMatch = b.skills.some(skill => skill.toLowerCase().includes(query)) ? 1 : 0;
                
                const aScore = aNameExact + aNamePartial + aSkillMatch;
                const bScore = bNameExact + bNamePartial + bSkillMatch;
                
                return bScore - aScore;
              });
            }
            break;
        }
        
        setFreelancers(allFreelancers);
        
        // Update pagination to reflect filtered results
        if (debouncedQuery.trim() && allFreelancers.length !== response.data.freelancers.length) {
          setPagination({
            ...response.data.pagination,
            total: allFreelancers.length,
            pages: Math.ceil(allFreelancers.length / pagination.limit)
          });
        } else {
          setPagination(response.data.pagination);
        }
      } else {
        throw new Error('Failed to fetch freelancers');
      }
    } catch (err) {
      console.error('Error fetching freelancers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch freelancers');
      toast({
        title: "Error",
        description: "Failed to load freelancers. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  // Effects
  useEffect(() => {
    fetchFreelancers();
  }, [debouncedQuery, filters, pagination.page, sortBy]);

  useEffect(() => {
    if (pagination.page !== 1) {
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  }, [debouncedQuery, filters, sortBy]);

  // Utility functions
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString();
  };
  const handleSkillToggle = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const clearFilters = () => {
    setFilters({
      skills: [],
      location: "",
      minRating: 0,
      maxRate: 5000,
      experienceLevel: "",
      availability: ""
    });
    setSearchQuery("");
  };

  const activeFiltersCount = filters.skills.length + 
    (filters.location ? 1 : 0) + 
    (filters.experienceLevel ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.maxRate < 5000 ? 1 : 0);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TheGigUp
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              <Link to="/client-dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <Link to="/find-talent" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
                Find Talent
              </Link>
              <Link to="/post-job" className="text-gray-700 hover:text-blue-600 transition-colors">
                Post Job
              </Link>
            </nav>            <div className="flex items-center space-x-3">
              {/* <Button variant="ghost" size="icon" className="relative">
                <MessageSquare className="h-5 w-5" />
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">3</span>
                </div>
              </Button> */}
              <Avatar className="h-8 w-8 ring-2 ring-blue-100">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">CL</AvatarFallback>
              </Avatar>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Logout
              </Button>
            </div>
          </div>        </div>
        <MobileNav 
          userLoggedIn={userLoggedIn}
          userRole={userRole}
          userProfile={userProfile}
        />
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
            Find Top Talent
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with skilled freelancers who can bring your projects to life
          </p>
            {/* Search Section */}
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search for skills, titles, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                />
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 justify-center">
                <span className="text-sm text-gray-600">Active filters:</span>
                {filters.skills.map(skill => (
                  <Badge 
                    key={skill} 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-red-100 transition-colors" 
                    onClick={() => handleSkillToggle(skill)}
                  >
                    {skill} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
                {filters.location && (
                  <Badge 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-red-100 transition-colors" 
                    onClick={() => setFilters(prev => ({ ...prev, location: "" }))}
                  >
                    📍 {filters.location} <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
                {filters.experienceLevel && (
                  <Badge 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-red-100 transition-colors" 
                    onClick={() => setFilters(prev => ({ ...prev, experienceLevel: "" }))}
                  >
                    {filters.experienceLevel} <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs hover:text-red-600">
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Enhanced Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <Card className="sticky top-24 bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Filter className="h-5 w-5 mr-2 text-blue-600" />
                      Filters
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Skills Filter */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center">
                      <Award className="h-4 w-4 mr-2 text-blue-600" />
                      Skills
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                      {popularSkills.map(skill => (
                        <label key={skill} className="flex items-center space-x-2 cursor-pointer p-1 rounded hover:bg-gray-50 transition-colors">
                          <Checkbox
                            checked={filters.skills.includes(skill)}
                            onCheckedChange={() => handleSkillToggle(skill)}
                          />
                          <span className="text-sm">{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Location Filter */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                      Location
                    </h4>
                    <Input
                      placeholder="Enter city, country..."
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                      className="bg-white/50"
                    />
                  </div>

                  <Separator />

                  {/* Experience Level Filter */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-blue-600" />
                      Experience Level
                    </h4>
                    <Select value={filters.experienceLevel} onValueChange={(value) => setFilters(prev => ({ ...prev, experienceLevel: value }))}>
                      <SelectTrigger className="bg-white/50">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any Experience</SelectItem>
                        <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                        <SelectItem value="expert">Expert (5+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Rate Filter */}
                  <div>
                    <h4 className="font-medium mb-3">Hourly Rate (₹)</h4>
                    <div className="space-y-3">
                      <Slider
                        value={[filters.maxRate]}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, maxRate: value[0] }))}
                        max={5000}
                        step={100}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>₹0</span>
                        <span>₹{filters.maxRate}+</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Minimum Rating Filter */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center">
                      <Star className="h-4 w-4 mr-2 text-blue-600" />
                      Minimum Rating
                    </h4>
                    <Select value={filters.minRating.toString()} onValueChange={(value) => setFilters(prev => ({ ...prev, minRating: Number(value) }))}>
                      <SelectTrigger className="bg-white/50">
                        <SelectValue placeholder="Any rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Any rating</SelectItem>
                        <SelectItem value="3">3+ stars</SelectItem>
                        <SelectItem value="4">4+ stars</SelectItem>
                        <SelectItem value="4.5">4.5+ stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={clearFilters} variant="outline" className="w-full">
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {isLoading ? "Searching..." : `${pagination.total} talented freelancers`}
                  </h2>
                  {debouncedQuery && (
                    <p className="text-sm text-gray-600">
                      Results for "{debouncedQuery}"
                    </p>
                  )}
                </div>
                
                {/* <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-blue-50 transition-all duration-200"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="destructive" className="ml-2 h-4 w-4 p-0 flex items-center justify-center text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button> */}
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-white/80 backdrop-blur-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Most Relevant</SelectItem>
                  <SelectItem value="rating-high">Highest Rated</SelectItem>
                  <SelectItem value="rating-low">Lowest Rated</SelectItem>
                  <SelectItem value="rate-high">Highest Rate</SelectItem>
                  <SelectItem value="rate-low">Lowest Rate</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Finding the best freelancers for you...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-16">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-red-600 mb-4">Error loading freelancers: {error}</p>
                  <Button onClick={fetchFreelancers} variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                    Try Again
                  </Button>
                </div>
              </div>
            )}            {/* Freelancers Grid */}
            {!isLoading && !error && (
              <div className="space-y-6">
                {/* Search Results Summary */}
                {debouncedQuery.trim() && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-blue-900">
                          Search Results for "{debouncedQuery}"
                        </h3>
                        <p className="text-sm text-blue-700">
                          {freelancers.length} freelancer{freelancers.length !== 1 ? 's' : ''} found
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSearchQuery("");
                          setDebouncedQuery("");
                        }}
                        className="border-blue-300 text-blue-700 hover:bg-blue-100"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Clear Search
                      </Button>
                    </div>
                  </div>
                )}
                
                {freelancers.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 max-w-md mx-auto">
                      <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-900 mb-2">No freelancers found</h3>
                      <p className="text-gray-600 mb-6">
                        Try adjusting your search criteria or filters to find more results
                      </p>
                      <Button onClick={clearFilters} variant="outline">
                        Clear All Filters
                      </Button>
                    </div>
                  </div>
                ) : (
                  freelancers.map((freelancer) => (
                    <Card key={freelancer.id} className="hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-gray-200 group">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-6">
                          {/* Avatar */}                          <div className="flex-shrink-0">
                            <Avatar className="w-20 h-20 ring-4 ring-blue-100 group-hover:ring-blue-200 transition-all">
                              <AvatarImage src={freelancer.user.profileImage || undefined} />
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl">
                                {freelancer.user.name?.charAt(0)?.toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          
                          {/* Main Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {freelancer.user.name || 'Anonymous User'}
                                </h3>
                                <p className="text-blue-600 font-medium">
                                  {freelancer.experience ? `${freelancer.experience} Experience` : 'Experience not specified'}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">
                                  {freelancer.hourlyRate ? `₹${freelancer.hourlyRate}` : 'Rate not set'}
                                  <span className="text-sm text-gray-500 font-normal">/hr</span>
                                </p>
                                <div className="flex items-center justify-end mt-1">
                                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                    <span className="text-sm font-medium text-gray-700 ml-1">
                                      {freelancer.ratings || 0}
                                    </span>
                                  </div>
                                  <span className="text-sm text-gray-500 ml-2">
                                    ({freelancer.projectsCompleted} projects)
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Stats Row */}                            <div className="flex items-center text-sm text-gray-600 mb-4 space-x-4">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1 text-blue-500" />
                                <span className="truncate max-w-[150px]">
                                  {freelancer.user.location || 'Location not specified'}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Briefcase className="h-4 w-4 mr-1 text-green-500" />
                                {freelancer.projectsCompleted} completed
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-purple-500" />
                                Member since {formatTimeAgo(freelancer.user.createdAt)}
                              </div>
                            </div>
                            
                            {/* Bio */}
                            <p className="text-gray-700 mb-4 line-clamp-2 leading-relaxed">
                              {freelancer.user.bio || 'Professional freelancer ready to help with your project needs.'}
                            </p>
                            
                            {/* Skills */}
                            <div className="flex flex-wrap gap-2 mb-6">
                              {freelancer.skills?.slice(0, 6).map((skill) => (
                                <Badge key={skill} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                                  {skill}
                                </Badge>
                              ))}
                              {freelancer.skills?.length > 6 && (
                                <Badge variant="outline" className="border-blue-200 text-blue-600">
                                  +{freelancer.skills.length - 6} more
                                </Badge>
                              )}
                              {freelancer.skills?.length === 0 && (
                                <Badge variant="outline" className="text-gray-500">
                                  No skills listed
                                </Badge>
                              )}
                            </div>
                              {/* Action Buttons */}
                            <div className="flex items-center justify-between">
                              <div className="flex space-x-3">
                                <Button 
                                  onClick={() => setSelectedFreelancer(freelancer)}
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6"
                                >
                                  <Mail className="h-4 w-4 mr-2" />
                                  Contact
                                </Button>                                <Button 
                                  variant="outline" 
                                  asChild
                                  className="hover:bg-blue-50 hover:border-blue-200"
                                >
                                  <Link 
                                    to={generatePublicProfileUrl(freelancer.user.name || 'Anonymous User', freelancer.id)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Profile
                                  </Link>
                                </Button>

                              </div>
                              
                              {freelancer.availability && (
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                  Available Now
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* Enhanced Pagination */}
            {!isLoading && !error && pagination.pages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page === 1}
                  className="bg-white/80 backdrop-blur-sm"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                
                <div className="flex items-center space-x-2">
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={pagination.page === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPagination(prev => ({ ...prev, page }))}
                        className={pagination.page === page 
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white" 
                          : "bg-white/80 backdrop-blur-sm"
                        }
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                  disabled={pagination.page === pagination.pages}
                  className="bg-white/80 backdrop-blur-sm"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>      {/* Contact Modal */}
      {selectedFreelancer && (
        <FreelancerContactModal
          freelancer={{
            id: selectedFreelancer.id,
            name: selectedFreelancer.user.name || 'Anonymous User',
            title: selectedFreelancer.experience ? `${selectedFreelancer.experience} Experience` : 'Experience not specified',
            skills: selectedFreelancer.skills,
            rate: selectedFreelancer.hourlyRate ? `₹${selectedFreelancer.hourlyRate}/hr` : 'Rate not set',
            rating: selectedFreelancer.ratings || 0,
            reviews: selectedFreelancer.projectsCompleted,
            location: selectedFreelancer.user.location || 'Location not specified',
            bio: selectedFreelancer.user.bio || 'No bio available.',
            email: selectedFreelancer.user.email
          }}
          isOpen={!!selectedFreelancer}
          onClose={() => setSelectedFreelancer(null)}
        />
      )}
    </div>
  );
};

export default FindTalent;
