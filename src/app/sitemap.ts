import { MetadataRoute } from 'next';

const BASE = 'https://www.hydra-pumps.com';
const locales = ['en','fr','de','it','ru','es','pt','nl','el','ja','ko','ar','hi','tr','id','vi','th','bn','fa','pl','zh'];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    // Static pages
    routes.push(
      { url: `${BASE}/${locale}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
      { url: `${BASE}/${locale}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
      { url: `${BASE}/${locale}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
      { url: `${BASE}/${locale}/about/factory`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
      { url: `${BASE}/${locale}/about/certificate`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
      { url: `${BASE}/${locale}/about/quality`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
      { url: `${BASE}/${locale}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
      { url: `${BASE}/${locale}/news`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
      { url: `${BASE}/${locale}/quote`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
      { url: `${BASE}/${locale}/cases`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    );
  }

  // Product URLs can be added dynamically
  return routes;
}
