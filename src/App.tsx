
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import PostJob from "./pages/PostJob";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import RoleBasedAccess from "./components/RoleBasedAccess";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes - accessible to everyone */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          
          {/* Authentication Routes - only for non-authenticated users */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } 
          />
          <Route 
            path="/client-signup" 
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } 
          />
          <Route 
            path="/freelancer-signup" 
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } 
          />

          {/* Client-Only Routes */}
          <Route 
            path="/client-dashboard" 
            element={
              <ProtectedRoute requiredRole="CLIENT">
                <ClientDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/client-profile-setup" 
            element={
              <ProtectedRoute requiredRole="CLIENT">
                <ClientProfileSetup />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/post-job" 
            element={
              <ProtectedRoute requiredRole="CLIENT">
                <PostJob />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/find-talent" 
            element={
              <ProtectedRoute requiredRole="CLIENT">
                <FindTalent />
              </ProtectedRoute>
            } 
          />

          {/* Freelancer-Only Routes */}
          <Route 
            path="/freelancer-dashboard" 
            element={
              <ProtectedRoute requiredRole="FREELANCER">
                <FreelancerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/freelancer-profile-setup" 
            element={
              <ProtectedRoute requiredRole="FREELANCER">
                <FreelancerProfileSetup />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/find-work" 
            element={
              <ProtectedRoute requiredRole="FREELANCER">
                <FindWork />
              </ProtectedRoute>
            } 
          />

          {/* Mixed Access Routes - Both roles can access */}
          <Route 
            path="/profile" 
            element={
              <RoleBasedAccess allowedRoles={['CLIENT', 'FREELANCER']}>
                <Profile />
              </RoleBasedAccess>
            } 
          />

          {/* Legacy/Redirect Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requiredRole="CLIENT" redirectTo="/client-dashboard">
                <ClientDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
