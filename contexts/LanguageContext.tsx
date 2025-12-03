import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect
} from 'react';
import { translations } from '../i18n/locales';

type Language = 'zh' | 'en';

type TranslationShape = typeof translations.zh;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dictionary: TranslationShape;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [language, setLanguage] = useState<Language>('zh');

  const t = (path: string): string => {
    const keys = path.split('.');
    let current: any = translations[language];

    for (const key of keys) {
      if (current[key] === undefined) {
        console.warn(`Translation missing for key: ${path}`);
        return path;
      }
      current = current[key];
    }

    return current as string;
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t, dictionary: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
