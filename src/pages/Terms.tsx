import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
    <nav className="w-full flex justify-between items-center px-8 py-4 bg-white/80 shadow-sm sticky top-0 z-10">
      <Link to="/" className="text-2xl font-bold text-blue-700">TheGigUp</Link>
      <div className="flex gap-6">
        <Link to="/terms" className="text-gray-700 hover:text-blue-600 font-medium">Terms</Link>
        <Link to="/privacy" className="text-gray-700 hover:text-blue-600 font-medium">Privacy Policy</Link>
        <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
      </div>
    </nav>
    <div className="w-full max-w-6xl mx-auto">
      <Card className="shadow-xl border-0 mt-8">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold text-gray-800">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700 text-lg">
          <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using TheGigUp, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
          </p>
          <h2 className="text-xl font-semibold mb-2">2. User Accounts</h2>
          <p>
            You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account and password.
          </p>
          <h2 className="text-xl font-semibold mb-2">3. Freelancer & Client Responsibilities</h2>
          <p>
            Freelancers agree to provide services in a professional manner. Clients agree to pay for completed work as agreed. Both parties must comply with all applicable laws.
          </p>
          <h2 className="text-xl font-semibold mb-2">4. Payments</h2>
          <p>
            All payments must be made through TheGigUp platform. We are not responsible for payments made outside the platform.
          </p>
          <h2 className="text-xl font-semibold mb-2">5. Prohibited Activities</h2>
          <p>
            Users may not post illegal, offensive, or fraudulent content, or use the platform for any unlawful purpose.
          </p>
          <h2 className="text-xl font-semibold mb-2">6. Termination</h2>
          <p>
            We reserve the right to suspend or terminate accounts that violate these terms or engage in harmful behavior.
          </p>
          <h2 className="text-xl font-semibold mb-2">7. Changes to Terms</h2>
          <p>
            TheGigUp may update these Terms of Service at any time. Continued use of the platform constitutes acceptance of the new terms.
          </p>
          <h2 className="text-xl font-semibold mb-2">8. Contact</h2>
          <p>
            For questions about these terms, please contact our support team.
          </p>
          <p>
            <Link to="/privacy" className="text-blue-600 hover:text-blue-500">Read our Privacy Policy</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default Terms;
