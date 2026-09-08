import { Suspense } from 'react';
import { fetchApi, flatProduct } from '@/lib/api-data';
import { categories as categoriesData } from '@/data/categories';
import { getTranslations } from 'next-intl/server';
import ProductsBrowser from '@/components/product/ProductsBrowser';
import ProductsView from '@/components/product/ProductsView';

// Cache the products listing (ISR) instead of rendering on every request.
export const revalidate = 3600;

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tt = await getTranslations({ locale, namespace: 'common' });

  const allProducts = (await fetchApi('/products')).map(flatProduct);

  const categories = categoriesData.map((c) => ({
    slug: c.slug,
    name_en: (c.name as Record<string, string>)['en'] || c.slug,
  }));

  const counts: Record<string, number> = {};
  allProducts.forEach((p: any) => { const s = p.category_slug || 'other'; counts[s] = (counts[s] || 0) + 1; });

  const viewProps = {
    locale,
    products: allProducts,
    categories,
    counts,
    homeLabel: tt('home'),
    productsLabel: tt('products'),
    getBestPriceLabel: tt('getBestPrice'),
  };

  return (
    <Suspense fallback={<ProductsView {...viewProps} category={null} />}>
      <ProductsBrowser {...viewProps} />
    </Suspense>
  );
}
