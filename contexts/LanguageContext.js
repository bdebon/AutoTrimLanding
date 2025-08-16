"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { en } from "../translations/en";
import { fr } from "../translations/fr";
import { es } from "../translations/es";
import { zh } from "../translations/zh";

const translations = {
  en,
  fr,
  es,
  zh,
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    // Get saved language from localStorage on mount
    const savedLang = localStorage.getItem("trimly-language") || "en";
    setLanguage(savedLang);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("trimly-language", lang);
  };

  const t = (key) => {
    const keys = key.split(".");
    let value = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
