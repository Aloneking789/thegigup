
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, DollarSign, Send, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PublicJobItem, FeaturedProject } from "@/lib/api/types";
import { freelancerService } from "@/lib/api/client";
import { RoleStorage } from "@/lib/config/api";

interface JobDetailModalProps {
  job: PublicJobItem | FeaturedProject | null;
  isOpen: boolean;
  onClose: () => void;
  showProposalForm?: boolean;
}

const JobDetailModal = ({ job, isOpen, onClose, showProposalForm = false }: JobDetailModalProps) => {
  const { toast } = useToast();
  const [proposal, setProposal] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendProposal = async () => {
    if (!proposal || !coverLetter) {
      toast({
        title: "Error",
        description: "Please fill in both proposal and cover letter fields.",
        variant: "destructive",
      });
      return;
    }

    if (!RoleStorage.isFreelancer()) {
      toast({
        title: "Error",
        description: "Only freelancers can apply to projects.",
        variant: "destructive",
      });
      return;
    }

    if (!job?.id) {
      toast({
        title: "Error",
        description: "Invalid project ID.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await freelancerService.applyToProject(job.id, {
        proposal,
        coverLetter,
      });

      if (response.success) {
        toast({
          title: "Proposal Sent!",
          description: "Your proposal has been submitted successfully.",
        });
        
        setProposal("");
        setCoverLetter("");
        onClose();
      } else {
        throw new Error(response.message || "Failed to submit proposal");
      }
    } catch (error) {
      console.error("Error submitting proposal:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit proposal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{job.title}</DialogTitle>
        </DialogHeader>
          <div className="space-y-6">
          {/* Job Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{job.client.company}</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm space-x-4">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{job.client.location}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{new Date(job.postedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Budget and Client Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-1" />
              <span>{job.applicationsCount} proposal{job.applicationsCount !== 1 ? 's' : ''}</span>
            </div>
            <div className="text-sm text-gray-600">
              Duration: {job.duration}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Job Description</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{job.description}</p>
          </div>

          {/* Skills */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* About Client */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">About the Client</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Client:</span> {job.client.name}</p>
              <p><span className="font-medium">Company:</span> {job.client.company}</p>
              <p><span className="font-medium">Industry:</span> {job.client.industry}</p>
              <p><span className="font-medium">Location:</span> {job.client.location}</p>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                <span>{job.client.ratings.toFixed(1)} rating</span>
              </div>
            </div>
          </div>          {/* Proposal Form */}
          {showProposalForm && (
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Send a Proposal</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposal
                  </label>
                  <Textarea
                    placeholder="Describe your approach and why you're the best fit for this project..."
                    rows={4}
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter
                  </label>
                  <Textarea
                    placeholder="Introduce yourself and highlight your relevant experience..."
                    rows={3}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleSendProposal}
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Sending..." : "Send Proposal"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailModal;
