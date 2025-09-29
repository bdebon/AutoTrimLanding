import React from "react";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Legal Notice</h1>

        <p className="text-gray-600 mb-8">Effective Date: January 2025</p>

        <div className="prose prose-lg max-w-none text-gray-600">
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Website Editor</h2>

          <div className="mb-6">
            <p className="mb-2"><strong>Company:</strong> bdebon SASU</p>
            <p className="mb-2"><strong>Legal status:</strong> SASU</p>
            <p className="mb-2"><strong>Share capital:</strong> €500</p>
            <p className="mb-2"><strong>Head office:</strong> Bordeaux, France</p>
            <p className="mb-2"><strong>RCS:</strong> Bordeaux</p>
            <p className="mb-2"><strong>SIRET:</strong> 83116964400018</p>
            <p className="mb-2"><strong>VAT number:</strong> FR75831169644</p>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Publication Director</h2>

          <div className="mb-6">
            <p className="mb-2"><strong>Name:</strong> Benjamin Debon</p>
            <p className="mb-2"><strong>Email:</strong> b1jam1code@gmail.com</p>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Hosting</h2>

          <div className="mb-6">
            <p className="mb-2">The website autotrim.app is hosted by:</p>
            <p className="mb-2"><strong>Vercel Inc.</strong></p>
            <p className="mb-2">340 S Lemon Ave #4133</p>
            <p className="mb-2">Walnut, CA 91789, United States</p>
            <p className="mb-4"></p>
            <p className="mb-2">Software binaries are hosted on:</p>
            <p className="mb-2"><strong>GitHub</strong></p>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Intellectual Property</h2>

          <p className="mb-6">
            All content on this website, including text, images, graphics, and logos, is the exclusive property of bdebon SASU
            unless otherwise stated. Any reproduction, distribution, or use of this content without prior written permission
            is strictly prohibited.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact</h2>

          <p className="mb-6">
            For any inquiries regarding this legal notice or the website, please contact us at b1jam1code@gmail.com.
          </p>
        </div>
      </div>
    </div>
  );
}