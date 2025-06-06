
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, DollarSign, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  budget: string;
  type: string;
  description: string;
  skills: string[];
  clientRating: number;
  clientReviews: number;
  isUrgent: boolean;
  isExperienced: boolean;
  timePosted: string;
  aboutClient: string;
}

interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  showProposalForm?: boolean;
}

const JobDetailModal = ({ job, isOpen, onClose, showProposalForm = false }: JobDetailModalProps) => {
  const { toast } = useToast();
  const [proposalText, setProposalText] = useState("");
  const [proposalBudget, setProposalBudget] = useState("");
  const [proposalTimeline, setProposalTimeline] = useState("");

  const handleSendProposal = () => {
    if (!proposalText || !proposalBudget || !proposalTimeline) {
      toast({
        title: "Error",
        description: "Please fill in all fields before sending your proposal.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Proposal Sent!",
      description: "Your proposal has been submitted successfully.",
    });
    
    setProposalText("");
    setProposalBudget("");
    setProposalTimeline("");
    onClose();
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
              <span className="font-medium text-gray-900">{job.company}</span>
              {job.isUrgent && (
                <Badge className="bg-red-100 text-red-800">URGENT</Badge>
              )}
              {job.isExperienced && (
                <Badge className="bg-purple-100 text-purple-800">EXPERIENCED</Badge>
              )}
            </div>
            <div className="flex items-center text-gray-600 text-sm space-x-4">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{job.timePosted}</span>
              </div>
            </div>
          </div>

          {/* Budget and Client Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1 text-green-600" />
              <span className="font-semibold text-gray-900">{job.budget}</span>
              <span className="text-gray-500 ml-1">({job.type})</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
              <span>Client rating: {job.clientRating} ({job.clientReviews} reviews)</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Job Description</h3>
            <p className="text-gray-600">{job.description}</p>
          </div>

          {/* Skills */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* About Client */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">About the Client</h3>
            <p className="text-sm text-gray-600">{job.aboutClient}</p>
          </div>

          {/* Proposal Form */}
          {showProposalForm && (
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Send a Proposal</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter
                  </label>
                  <Textarea
                    placeholder="Explain why you're the best fit for this project..."
                    rows={4}
                    value={proposalText}
                    onChange={(e) => setProposalText(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Bid
                    </label>
                    <Input
                      placeholder="₹50,000"
                      value={proposalBudget}
                      onChange={(e) => setProposalBudget(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timeline
                    </label>
                    <Input
                      placeholder="2 weeks"
                      value={proposalTimeline}
                      onChange={(e) => setProposalTimeline(e.target.value)}
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleSendProposal}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Proposal
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
