import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const TermsModal = ({ isOpen, onClose, onAccept }: TermsModalProps) => {
  const [isAccepted, setIsAccepted] = useState(false);

  const handleAccept = () => {
    if (isAccepted) {
      onAccept();
    }
  };

  const handleClose = () => {
    setIsAccepted(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            Terms and Conditions - Disclaimer
          </DialogTitle>
          <DialogDescription>
            Please read and accept the following terms and conditions to continue with your signup.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 max-h-[500px] pr-4">
          <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h2 className="text-lg font-bold text-orange-800 mb-2">Disclaimer for TheGigUp</h2>
              <p className="text-orange-700">
                TheGigUp (thegigup.com) is a platform designed to connect freelancers and clients for professional services. 
                By using our website, you acknowledge and agree to the following:
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">No Liability for Transactions or Interactions:</h3>
                <p className="mb-2">
                  TheGigUp acts solely as a platform to facilitate connections between freelancers and clients. We are not a party to any agreement, 
                  contract, or transaction between users. TheGigUp is not responsible or liable for any disputes, losses, damages, or issues arising from interactions, including but not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Non-payment, delayed payment, or payment disputes between freelancers and clients.</li>
                  <li>Misbehavior, unprofessional conduct, or breach of agreement by any user.</li>
                  <li>Any physical harm, injury, or property damage resulting from in-person meetings, services, or interactions arranged through the platform.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">User Responsibility:</h3>
                <p className="mb-2">Freelancers and clients are solely responsible for:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Verifying the identity, credentials, and reliability of other users before engaging in services or transactions.</li>
                  <li>Negotiating, agreeing upon, and fulfilling the terms of their contracts or agreements.</li>
                  <li>Ensuring safe practices during any in-person interactions, including meeting in secure locations and adhering to local laws.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">No Guarantee of Service Quality:</h3>
                <p>
                  TheGigUp does not endorse, verify, or guarantee the quality, accuracy, or legality of services provided by freelancers or the suitability of clients. 
                  Users are encouraged to conduct due diligence, review profiles, and use secure payment methods outside the platform if needed.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Third-Party Services:</h3>
                <p>
                  Any third-party tools, payment gateways, or services used for communication or transactions (e.g., PayPal, Stripe) are subject to their own terms and conditions. 
                  TheGigUp is not liable for issues arising from third-party services.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Compliance with Laws:</h3>
                <p>
                  Users must comply with all applicable local, state, national, and international laws when using TheGigUp. 
                  The platform is not responsible for any legal violations by users.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Limitation of Liability:</h3>
                <p>
                  To the fullest extent permitted by law, TheGigUp, its affiliates, employees, or partners shall not be liable for any direct, indirect, incidental, 
                  consequential, or punitive damages arising from the use of our platform or interactions between users.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="font-medium">
                  By using TheGigUp, you agree to indemnify and hold harmless TheGigUp from any claims, damages, or liabilities resulting from your use of the platform or interactions with other users. 
                  For full details, please review our Terms of Service and Privacy Policy.
                </p>
                <p className="mt-2 text-sm">
                  If you have concerns about a freelancer or client, please report them to us at{" "}
                  <a href="mailto:support@thegigup.com" className="text-blue-600 hover:underline">
                    support@thegigup.com
                  </a>{" "}
                  for review under our community guidelines.
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="border-t pt-4 space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="accept-terms"
              checked={isAccepted}
              onCheckedChange={setIsAccepted}
              className="mt-1"
            />
            <label htmlFor="accept-terms" className="text-sm font-medium leading-relaxed cursor-pointer">
              I have read and agree to the Terms and Conditions, Disclaimer, and Privacy Policy. 
              I understand that TheGigUp is not liable for any transactions, disputes, or interactions between users.
            </label>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleAccept} 
              disabled={!isAccepted}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Accept and Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TermsModal;
