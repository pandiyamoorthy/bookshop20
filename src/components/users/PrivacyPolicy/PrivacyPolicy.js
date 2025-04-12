import React from 'react';
import Header from '../../Header/Header';

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-12 mt-20">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              Welcome to Barathy Books ("we," "our," "us"). Your privacy is important to us, and we are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Information We Collect</h2>
              <p className="text-gray-600 mb-4">We may collect the following types of information:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li><span className="font-medium">Personal Information:</span> Name, email address, phone number, billing/shipping address, payment details, and other details required for order processing.</li>
                <li><span className="font-medium">Account Information:</span> Username, password, and order history if you create an account.</li>
                <li><span className="font-medium">Usage Data:</span> IP address, browser type, pages visited, and interactions with our website.</li>
                <li><span className="font-medium">Cookies and Tracking Technologies:</span> To enhance user experience and improve our services.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">We use your information for the following purposes:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>To process and fulfill your orders.</li>
                <li>To provide customer support and respond to inquiries.</li>
                <li>To improve and personalize your shopping experience.</li>
                <li>To send order confirmations, updates, and promotional offers (with your consent).</li>
                <li>To monitor website security and prevent fraudulent activities.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Sharing Your Information</h2>
              <p className="text-gray-600 mb-4">We do not sell, trade, or rent your personal information. However, we may share it with:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li><span className="font-medium">Service Providers:</span> Third-party payment processors, shipping partners, and analytics tools to enhance our services.</li>
                <li><span className="font-medium">Legal Compliance:</span> If required by law or to protect our rights and customers.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Data Security</h2>
              <p className="text-gray-600">
                We implement industry-standard security measures to protect your information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Cookies and Tracking Technologies</h2>
              <p className="text-gray-600 mb-4">We use cookies to:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Improve website functionality.</li>
                <li>Analyze website traffic and user interactions.</li>
                <li>Provide personalized content and advertisements.</li>
              </ul>
              <p className="text-gray-600 mt-4">You can manage cookie preferences through your browser settings.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Your Rights</h2>
              <p className="text-gray-600 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Access, update, or delete your personal information.</li>
                <li>Opt-out of marketing communications.</li>
                <li>Request a copy of the data we store about you.</li>
              </ul>
              <p className="text-gray-600 mt-4">To exercise these rights, contact us at support@barathybooks.com</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Third-Party Links</h2>
              <p className="text-gray-600">
                Our website may contain links to third-party websites. We are not responsible for their privacy practices. Please review their policies before providing any personal information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Changes to This Policy</h2>
              <p className="text-gray-600">
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Effective Date."
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Contact Us</h2>
              <div className="text-gray-600 space-y-2">
                <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                <div className="mt-4">
                  <p className="font-medium">Barathy Books</p>
                  <p>123 Book Street</p>
                  <p>Chennai, Tamil Nadu 600001</p>
                  <p>Email: support@barathybooks.com</p>
                  <p>Phone: +91 (123) 456-7890</p>
                </div>
              </div>
            </section>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-gray-600 text-center">
                By using our website, you agree to the terms of this Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;