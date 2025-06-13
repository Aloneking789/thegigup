
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import FreelancerProfileSetup from "./pages/FreelancerProfileSetup";
import ClientProfileSetup from "./pages/ClientProfileSetup";
import FindTalent from "./pages/FindTalent";
import FindWork from "./pages/FindWork";
import About from "./pages/About";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import PostJob from "./pages/PostJob";
import PublicProfile from "./pages/PublicProfile";
import HowToFindWork from "./pages/HowToFindWork";
import SkillDevelopment from "./pages/SkillDevelopment";
import SuccessStories from "./pages/SuccessStories";
import NotFound from "./pages/NotFound";
// import Careers from "./pages/Careers";
import Press from "./pages/Press";
import ContactSupport from "./pages/ContactSupport";
import GetStarted from "./pages/GetStarted";
import SuccessTips from "./pages/SuccessTips";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>        <Routes>          {/* Public routes - only accessible when not logged in */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />          <Route path="/how-to-find-work" element={<HowToFindWork />} />
          <Route path="/skill-development" element={<SkillDevelopment />} />
          <Route path="/success-stories" element={<SuccessStories />} />
          {/* <Route path="/careers" element={<Careers />} /> */}
          <Route path="/press" element={<Press />} />
          <Route path="/contact-support" element={<ContactSupport />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/success-tips" element={<SuccessTips />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/client-signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/freelancer-signup" element={<PublicRoute><Signup /></PublicRoute>} />

          {/* Public profile route - accessible to everyone */}
          <Route path="/profile/:nameSlug/:userId" element={<PublicProfile />} />

          {/* Protected routes - require authentication */}
          <Route path="/client-dashboard" element={<ProtectedRoute allowedRoles={['CLIENT']}><ClientDashboard /></ProtectedRoute>} />
          <Route path="/freelancer-dashboard" element={<ProtectedRoute allowedRoles={['FREELANCER']}><FreelancerDashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
          
          {/* Profile setup routes */}
          <Route path="/freelancer-profile-setup" element={<ProtectedRoute allowedRoles={['FREELANCER']}><FreelancerProfileSetup /></ProtectedRoute>} />
          <Route path="/client-profile-setup" element={<ProtectedRoute allowedRoles={['CLIENT']}><ClientProfileSetup /></ProtectedRoute>} />
          
          {/* General protected routes */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          
          {/* Client-specific routes */}
          <Route path="/find-talent" element={<ProtectedRoute allowedRoles={['CLIENT']}><FindTalent /></ProtectedRoute>} />
          <Route path="/post-job" element={<ProtectedRoute allowedRoles={['CLIENT']}><PostJob /></ProtectedRoute>} />
          
          {/* Freelancer-specific routes */}
          <Route path="/find-work" element={<ProtectedRoute allowedRoles={['FREELANCER']}><FindWork /></ProtectedRoute>} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
