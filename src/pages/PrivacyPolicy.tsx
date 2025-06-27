import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
    <nav className="w-full flex justify-between items-center px-4 sm:px-8 py-4 bg-white/80 shadow-sm sticky top-0 z-10">
      <Link to="/" className="text-xl sm:text-2xl font-bold text-blue-700">TheGigUp</Link>
      <div className="flex gap-3 sm:gap-6">
        <a href="https://www.thegigup.com/terms" className="text-sm sm:text-base text-gray-700 hover:text-blue-600 font-medium">Terms</a>
        <a href="https://www.thegigup.com/privacy" className="text-sm sm:text-base text-gray-700 hover:text-blue-600 font-medium">Privacy</a>
        <Link to="/" className="text-sm sm:text-base text-gray-700 hover:text-blue-600 font-medium">Home</Link>
      </div>
    </nav>
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card className="shadow-xl border-0 mt-8 mb-8">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700 text-base sm:text-lg">
          <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
          <p>
            We collect personal information such as your name, email address when you register or use TheGigUp. We may also collect information about your usage of the platform.
          </p>
          <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
          <p>
            Your information is used to provide and improve our services, communicate with you, and ensure platform security.
          </p>
          <h2 className="text-xl font-semibold mb-2">3. Sharing of Information</h2>
          <p>
            We do not sell your personal information. We may share information with third-party service providers as necessary to operate the platform, or as required by law.
          </p>
          <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
          <p>
            We implement reasonable security measures to protect your data. However, no method of transmission over the Internet is 100% secure.
          </p>
          <h2 className="text-xl font-semibold mb-2">5. Cookies</h2>
          <p>
            TheGigUp uses cookies to enhance your experience. You can disable cookies in your browser settings, but some features may not work properly.
          </p>
          <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
          <p>
            You may access, update, or delete your personal information at any time by contacting support or using your account settings.
          </p>
          <h2 className="text-xl font-semibold mb-2">7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page.
          </p>
          <h2 className="text-xl font-semibold mb-2">8. Contact</h2>
          <p>
            For questions about this Privacy Policy, please contact our support team.
          </p>
          <p>
            <a href="https://www.thegigup.com/terms" className="text-blue-600 hover:text-blue-500">Read our Terms of Service</a>
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default PrivacyPolicy;
