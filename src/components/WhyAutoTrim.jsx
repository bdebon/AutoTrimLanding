import React from 'react';
import { Clock, FileText, Shield } from 'lucide-react';

const WhyAutoTrim = () => {
  const benefits = [
    {
      icon: Clock,
      title: 'Save Hours Every Week',
      description: 'Stop wasting time manually trimming silences, filler words and awkward pauses.',
      highlight: 'AutoTrim cuts your raw footage in seconds.',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
    },
    {
      icon: FileText,
      title: 'One Clean Timeline',
      description: 'No puzzle to reassemble. Export one polished XML timeline directly to your editor.',
      highlight: 'All clips on one timeline, ready to go.',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
    },
    {
      icon: Shield,
      title: 'Super Fast, Private, Local',
      description: 'No cloud processing. Everything runs offline, on your machine.',
      highlight: 'Secure, private and blazing fast.',
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why AutoTrim?
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${benefit.bgGradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity`}></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${benefit.bgGradient} mb-6`}>
                  <benefit.icon className="h-8 w-8 text-gray-700" strokeWidth={2} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {benefit.description}
                </p>
                
                <p className={`text-sm font-semibold bg-gradient-to-r ${benefit.gradient} bg-clip-text text-transparent`}>
                  → {benefit.highlight}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyAutoTrim;