// Helper: get localized string, fall back to English
export function t(obj: Record<string, string> | undefined, locale: string, fallback?: string): string {
  if (!obj) return fallback || '';
  return obj[locale] || obj['en'] || fallback || '';
}

// Helper for DB rows: get localized field value
// row is a flat object with name_en, name_zh, etc.
export function loc(row: any, field: string, locale: string): string {
  if (!row) return '';
  const key = `${field}_${locale}`;
  return row[key] || row[`${field}_en`] || '';
}
