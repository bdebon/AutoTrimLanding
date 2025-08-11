import React from 'react';
import { Scissors } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src="/assets/img/logo-autotrim.svg" 
              alt="AutoTrim" 
              className="h-6 w-auto"
            />
          </div>

          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <a href="#buy" className="text-gray-700 hover:text-gray-900 text-sm transition-colors">
              Already tried? Buy license
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
              {t('footer.links.privacy')}
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
              {t('footer.links.terms')}
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
              {t('footer.links.contact')}
            </a>
          </div>

          <div className="text-gray-600 text-sm">
            © 2024 AutoTrim. Built by Benjamin Code
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;