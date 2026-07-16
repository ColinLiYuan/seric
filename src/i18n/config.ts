export const locales = [
  'en', 'fr', 'de', 'it', 'ru', 'es', 'pt', 'nl', 'el',
  'ja', 'ko', 'ar', 'hi', 'tr', 'id', 'vi', 'th', 'bn',
  'fa', 'pl', 'zh',
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  ru: 'Русский',
  es: 'Español',
  pt: 'Português',
  nl: 'Nederlandse',
  el: 'ελληνικά',
  ja: '日本語',
  ko: '한국',
  ar: 'العربية',
  hi: 'हिन्दी',
  tr: 'Türkçe',
  id: 'Indonesia',
  vi: 'Tiếng Việt',
  th: 'ไทย',
  bn: 'বাংলা',
  fa: 'فارسی',
  pl: 'Polski',
  zh: '中文',
};

// ISO 3166-1 alpha-2 country codes for flag images
export const localeCodes: Record<Locale, string> = {
  en: 'gb', fr: 'fr', de: 'de', it: 'it', ru: 'ru', es: 'es',
  pt: 'pt', nl: 'nl', el: 'gr', ja: 'jp', ko: 'kr', ar: 'ae',
  hi: 'in', tr: 'tr', id: 'id', vi: 'vn', th: 'th', bn: 'bd',
  fa: 'ir', pl: 'pl', zh: 'cn',
};
