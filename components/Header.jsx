import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const Header = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#features', label: t('nav.features') },
    { href: '#how-it-works', label: t('nav.howItWorks') },
    { href: '#pricing', label: t('nav.pricing') },
    { href: '#faq', label: t('nav.faq') },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl shadow-sm' 
          : 'bg-transparent'
      } transition-all duration-300`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <img 
                src="/assets/img/logo-autotrim.svg" 
                alt="AutoTrim" 
                className="h-8 w-auto"
              />
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/download"
              className="hidden md:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 shadow-sm"
            >
              {t('nav.downloadBeta')}
            </a>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl absolute top-16 left-0 right-0 shadow-lg rounded-b-2xl">
            <div className="px-4 py-2 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/download"
                className="block bg-gradient-to-r from-primary-500 to-primary-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-primary-600 hover:to-primary-700 mt-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.downloadBeta')}
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;