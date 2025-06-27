import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
    <nav className="w-full flex justify-between items-center px-4 sm:px-8 py-4 bg-white/80 shadow-sm sticky top-0 z-10">
      <Link to="/" className="text-xl sm:text-2xl font-bold text-blue-700">TheGigUp</Link>
      <div className="flex gap-3 sm:gap-6">
        <a href="https://www.thegigup.com/terms" className="text-sm sm:text-base text-gray-700 hover:text-blue-600 font-medium">Terms</a>
        <a href="https://www.thegigup.com/privacy" className="text-sm sm:text-base text-gray-700 hover:text-blue-600 font-medium">Privacy</a>
        <Link to="/" className="text-sm sm:text-base text-gray-700 hover:text-blue-600 font-medium">Home</Link>
      </div>    </nav>
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card className="shadow-xl border-0 mt-8 mb-8">        <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800">Terms and Conditions - Disclaimer</CardTitle>
      </CardHeader>
        <CardContent className="text-gray-700 text-base sm:text-lg">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-bold text-orange-800 mb-2">Disclaimer for TheGigUp</h2>
            <p className="text-orange-700">
              TheGigUp (www.thegigup.com) is a platform designed to connect freelancers and clients for professional services.
              By using our website, you acknowledge and agree to the following:
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Liability for Transactions or Interactions:</h3>
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">User Responsibility:</h3>
              <p className="mb-2">Freelancers and clients are solely responsible for:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Verifying the identity, credentials, and reliability of other users before engaging in services or transactions.</li>
                <li>Negotiating, agreeing upon, and fulfilling the terms of their contracts or agreements.</li>
                <li>Ensuring safe practices during any in-person interactions, including meeting in secure locations and adhering to local laws.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Guarantee of Service Quality:</h3>
              <p>
                TheGigUp does not endorse, verify, or guarantee the quality, accuracy, or legality of services provided by freelancers or the suitability of clients.
                Users are encouraged to conduct due diligence, review profiles, and use secure payment methods outside the platform if needed.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Third-Party Services:</h3>
              <p>
                Any third-party tools, payment gateways, or services used for communication or transactions (e.g., PayPal, Stripe) are subject to their own terms and conditions.
                TheGigUp is not liable for issues arising from third-party services.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Compliance with Laws:</h3>
              <p>
                Users must comply with all applicable local, state, national, and international laws when using TheGigUp.
                The platform is not responsible for any legal violations by users.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Limitation of Liability:</h3>
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
        </CardContent>

      </Card>



      <Card className="shadow-xl border-0 mt-8">        <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800">Terms of Service</CardTitle>
      </CardHeader>
        <CardContent className="space-y-4 text-gray-700 text-base sm:text-lg">
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
          {/* <h2 className="text-xl font-semibold mb-2">4. Payments</h2>
          <p>
            All payments must be made through TheGigUp platform. We are not responsible for payments made outside the platform.
          </p> */}
          <h2 className="text-xl font-semibold mb-2">4. Prohibited Activities</h2>
          <p>
            Users may not post illegal, offensive, or fraudulent content, or use the platform for any unlawful purpose.
          </p>
          <h2 className="text-xl font-semibold mb-2">5. Termination</h2>
          <p>
            We reserve the right to suspend or terminate accounts that violate these terms or engage in harmful behavior.
          </p>
          <h2 className="text-xl font-semibold mb-2">6. Changes to Terms</h2>
          <p>
            TheGigUp may update these Terms of Service at any time. Continued use of the platform constitutes acceptance of the new terms.
          </p>
          <h2 className="text-xl font-semibold mb-2">7. Contact</h2>
          <p>
            For questions about these terms, please contact our support team.
          </p>
          <p>
            <a href="https://www.thegigup.com/privacy" className="text-blue-600 hover:text-blue-500">Read our Privacy Policy</a>
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default Terms;
