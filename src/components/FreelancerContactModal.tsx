
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Freelancer {
  id: string;
  name: string;
  title: string;
  skills: string[];
  rate: string;
  rating: number;
  reviews: number;
  location: string;
  bio: string;
}

interface FreelancerContactModalProps {
  freelancer: Freelancer | null;
  isOpen: boolean;
  onClose: () => void;
}

const FreelancerContactModal = ({ freelancer, isOpen, onClose }: FreelancerContactModalProps) => {
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (!subject || !message) {
      toast({
        title: "Error",
        description: "Please fill in both subject and message fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message Sent!",
      description: `Your message has been sent to ${freelancer?.name}.`,
    });
    
    setSubject("");
    setMessage("");
    onClose();
  };

  if (!freelancer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Contact {freelancer.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900">{freelancer.name}</h3>
            <p className="text-blue-600 text-sm">{freelancer.title}</p>
            <p className="text-gray-600 text-sm mt-1">{freelancer.bio}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <Input
              placeholder="Project inquiry..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <Textarea
              placeholder="Hi, I'm interested in hiring you for a project..."
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <Button 
            onClick={handleSendMessage}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FreelancerContactModal;
