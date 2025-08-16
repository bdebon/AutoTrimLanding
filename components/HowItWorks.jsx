import React from 'react';
import { Upload, Cpu, Download, Coffee, Play, ArrowRight, MousePointerClick, Settings, FileDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

const HowItWorks = () => {
  const t = useTranslations();

  const steps = [
    {
      icon: Upload,
      title: t('howItWorks.steps.step1.title'),
      description: t('howItWorks.steps.step1.description'),
      bgGradient: 'from-primary-50 to-primary-100',
      iconColor: '#0EA5E9',
      image: '/assets/img/gif1.gif',
    },
    {
      icon: Cpu,
      title: t('howItWorks.steps.step2.title'),
      description: t('howItWorks.steps.step2.description'),
      bgGradient: 'from-secondary-50 to-secondary-100',
      iconColor: '#F97316',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop',
    },
    {
      icon: Download,
      title: t('howItWorks.steps.step3.title'),
      description: t('howItWorks.steps.step3.description'),
      bgGradient: 'from-green-50 to-green-100',
      iconColor: '#10B981',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('howItWorks.title')}
          </h2>
          <p className="text-xl font-medium bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            {t('hero.tagline')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="group">
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 h-full overflow-hidden">
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  <img 
                    src={step.image} 
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-4 left-4 inline-flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl shadow-md`}>
                    <step.icon className={`h-6 w-6`} style={{ color: step.iconColor }} />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-10 text-center shadow-lg">
          <Coffee className="h-10 w-10 text-white/90 mx-auto mb-4" />
          <p className="text-xl font-medium text-white mb-6">
            {t('howItWorks.conclusion')}
          </p>
          
          <a
            href="#demo"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors group shadow-md"
          >
            <Play className="w-4 h-4 mr-2" />
            {t('howItWorks.demoCta')}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;