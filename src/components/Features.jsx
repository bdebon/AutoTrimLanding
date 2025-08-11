import React from 'react';
import { Zap, Download, Scissors, Shield, Award, Globe, Sparkles, CheckCircle, Clock, Globe2 } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const Features = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Zap,
      title: t('features.list.parallel.title'),
      description: t('features.list.parallel.description'),
      bgGradient: 'from-yellow-50 to-orange-50',
      iconColor: '#F97316',
    },
    {
      icon: Download,
      title: t('features.list.timeline.title'),
      description: t('features.list.timeline.description'),
      bgGradient: 'from-primary-50 to-primary-100',
      iconColor: '#0EA5E9',
    },
    {
      icon: Scissors,
      title: t('features.list.cuts.title'),
      description: t('features.list.cuts.description'),
      bgGradient: 'from-green-50 to-emerald-50',
      iconColor: '#10B981',
    },
    {
      icon: Shield,
      title: t('features.list.privacy.title'),
      description: t('features.list.privacy.description'),
      bgGradient: 'from-purple-50 to-purple-100',
      iconColor: '#8B5CF6',
    },
    {
      icon: Award,
      title: t('features.list.license.title'),
      description: t('features.list.license.description'),
      bgGradient: 'from-red-50 to-rose-50',
      iconColor: '#EF4444',
    },
    {
      icon: Globe,
      title: t('features.list.ai.title'),
      description: t('features.list.ai.description'),
      bgGradient: 'from-blue-50 to-blue-100',
      iconColor: '#3B82F6',
    },
  ];

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl mb-4">
            <Sparkles className="h-6 w-6 text-secondary-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('features.title')}
          </h2>
        </div>

        {/* Key Benefits Bar */}
        <div className="flex items-center justify-center gap-6 flex-wrap mb-12">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>No subscription</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 text-blue-500" />
            <span>Instant results</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="h-4 w-4 text-purple-500" />
            <span>100% private</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Globe2 className="h-4 w-4 text-orange-500" />
            <span>Works offline</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div className="relative">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.bgGradient} mb-4`}>
                  <feature.icon className={`h-6 w-6`} style={{ color: feature.iconColor }} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;