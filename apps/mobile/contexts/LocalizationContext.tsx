import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as Localization from 'expo-localization';
import i18n from '@/lib/i18n';

type Locale = 'en' | 'ar';

interface LocalizationContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isRTL: boolean;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export function LocalizationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const deviceLocale = Localization.getLocales()?.[0]?.languageCode;
    if (deviceLocale === 'ar') {
      setLocaleState('ar');
      i18n.changeLanguage('ar');
    } else {
      i18n.changeLanguage('en');
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    i18n.changeLanguage(newLocale);
  }, []);

  const isRTL = locale === 'ar';

  return (
    <LocalizationContext.Provider value={{ locale, setLocale, isRTL }}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocalizationContext);
  if (!context) throw new Error('useLocale must be used within LocalizationProvider');
  return context;
}
