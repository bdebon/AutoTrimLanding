import { useState, useEffect } from 'react';
import { en } from '../translations/en';

const translations = {
  en,
};

export const useTranslation = () => {
  const [language, setLanguage] = useState('en');
  
  useEffect(() => {
    const savedLang = localStorage.getItem('trimly-language') || 'en';
    setLanguage(savedLang);
  }, []);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('trimly-language', lang);
  };

  return { t, language, changeLanguage };
};