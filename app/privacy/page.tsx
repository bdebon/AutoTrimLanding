import React from "react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

        <p className="text-gray-600 mb-8">Effective Date: January 2025</p>

        <div className="prose prose-lg max-w-none text-gray-600">
          <p className="mb-6">
            We respect your privacy. This Privacy Policy explains how we handle your data when you use our Website and Software.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Purchase Information</h3>
          <p className="mb-6">
            When you buy AutoTrim, our payment processor (LemonSqueezy or equivalent) collects your name, email, and payment
            details. We do not store your payment data.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Analytics & Cookies</h3>
          <p className="mb-6">
            We may use basic analytics tools to understand website usage.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Information We Do Not Collect</h2>
          <p className="mb-6">
            AutoTrim processes your video files entirely on your computer. We do not upload, store, or access your media files.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside mb-6">
            <li className="mb-2">To deliver your license key and provide support.</li>
            <li className="mb-2">To communicate important updates or product improvements.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Your Choices</h2>
          <p className="mb-6">
            You may request deletion of your personal data or unsubscribe from communications by contacting us.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Security</h2>
          <p className="mb-6">
            We take reasonable measures to protect your data, though no method is 100% secure.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Contact</h2>
          <p className="mb-6">
            If you have questions, contact us at b1jam1code@gmail.com.
          </p>
        </div>
      </div>
    </div>
  );
}