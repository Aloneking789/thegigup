
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  DollarSign, 
  Eye, 
  Send,
  Briefcase,
  Settings,
  Star,
  Loader2,
  Users,
  User,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MobileNav from "@/components/MobileNav";
import JobDetailModal from "@/components/JobDetailModal";
import { publicService } from "@/lib/api/client";
import { PublicJob } from "@/lib/api/types";
import { useToast } from "@/hooks/use-toast";
import { isLoggedIn, logout } from "@/lib/config/api";

const FindWork = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedJob, setSelectedJob] = useState<PublicJob | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [showProposalForm, setShowProposalForm] = useState(false);
  
  // API state
  const [jobs, setJobs] = useState<PublicJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  // Fetch jobs when filters change
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [debouncedSearchTerm, selectedCategory, sortBy]);

  useEffect(() => {
    fetchJobs();
  }, [currentPage, debouncedSearchTerm, selectedCategory, sortBy]);
  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit: 12,
        query: debouncedSearchTerm,
        skills: selectedCategory ? [selectedCategory] : undefined,
      };

      const response = await publicService.getJobs(params);
      
      if (response.success) {
        setJobs(response.data.jobs);
        setTotalResults(response.data.pagination.total);
      } else {
        setError('Failed to fetch jobs');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load jobs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  };

  const handleViewDetails = (job: PublicJob) => {
    setSelectedJob(job);
    setShowProposalForm(false);
    setIsJobModalOpen(true);
  };
  const handleSendProposal = (job: PublicJob) => {
    setSelectedJob(job);
    setShowProposalForm(true);
    setIsJobModalOpen(true);
  };

  // Handle user logout
  const handleLogout = () => {
    logout();
    navigate('/');
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
            </div>            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/find-talent" className="text-gray-600 hover:text-blue-600">Find Talent</Link>
              <Link to="/find-work" className="text-blue-600 font-medium">Find Work</Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-600">About</Link>
              {isLoggedIn() ? (
                <div className="flex items-center space-x-4">
                  <Link to="/profile">
                    <Button variant="outline" size="sm">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Log In
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-blue-600 hover:bg-blue-700">Sign Up</Button>
                  </Link>
                </div>
              )}
            </nav>
            <MobileNav currentPath={location.pathname} />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Work</h1>
          <p className="text-gray-600">Discover opportunities that match your skills</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="writing">Writing</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="budget-high">Highest Budget</SelectItem>
                <SelectItem value="budget-low">Lowest Budget</SelectItem>
                <SelectItem value="proposals">Fewest Proposals</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>          </div>
        </div>

        {/* Results Summary */}
        {!isLoading && !error && (
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {totalResults > 0 ? (
                  <>
                    Showing <span className="font-medium">{((currentPage - 1) * 12) + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(currentPage * 12, totalResults)}</span> of{' '}
                    <span className="font-medium">{totalResults.toLocaleString()}</span> jobs
                    {debouncedSearchTerm && (
                      <span> for "<span className="font-medium">{debouncedSearchTerm}</span>"</span>
                    )}
                  </>
                ) : (
                  'No jobs found'
                )}
              </div>
              {totalResults > 0 && (
                <div className="text-sm text-gray-500">
                  Page {currentPage} of {Math.ceil(totalResults / 12)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Job Listings */}
        <div className="space-y-6">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading jobs...</span>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6 text-center">
                <p className="text-red-600">{error}</p>
                <Button 
                  onClick={fetchJobs} 
                  className="mt-4"
                  variant="outline"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* No Results */}
          {!isLoading && !error && jobs.length === 0 && (
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-6 text-center">
                <p className="text-gray-600">No jobs found matching your criteria.</p>
              </CardContent>
            </Card>
          )}

          {/* Job Cards */}
          {!isLoading && !error && jobs.map((job) => (
            <Card key={job.id} className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm space-x-4">
                        <span className="font-medium">{job.client.company}</span>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{job.client.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{formatTimeAgo(job.postedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Budget and Info */}
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                      <span className="font-semibold text-gray-900">
                        ${job.budget.min.toLocaleString()} - ${job.budget.max.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                      <span>Client rating: {job.client.ratings.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{job.applicationsCount} proposal{job.applicationsCount !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Duration: {job.duration}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 line-clamp-3">{job.description}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {job.skillsRequired.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  {/* About Client */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">About the Client</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Company:</span> {job.client.company}</p>
                      <p><span className="font-medium">Industry:</span> {job.client.industry}</p>
                      <p><span className="font-medium">Location:</span> {job.client.location}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-gray-200"
                      onClick={() => handleViewDetails(job)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleSendProposal(job)}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Proposal
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>          ))}

          {/* Pagination */}
          {!isLoading && !error && jobs.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-8 p-6 bg-white rounded-lg border">
              <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                Showing {jobs.length} of {totalResults.toLocaleString()} jobs
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600 px-3">
                  Page {currentPage}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={jobs.length < 12}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <JobDetailModal
        job={selectedJob}
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        showProposalForm={showProposalForm}
      />
    </div>
  );
};

export default FindWork;
