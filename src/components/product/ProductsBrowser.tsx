'use client';

import { useSearchParams } from 'next/navigation';
import ProductsView, { type ProductsCategory } from './ProductsView';

export default function ProductsBrowser({
  locale,
  products,
  categories,
  counts,
  homeLabel,
  productsLabel,
  getBestPriceLabel,
}: {
  locale: string;
  products: any[];
  categories: ProductsCategory[];
  counts: Record<string, number>;
  homeLabel: string;
  productsLabel: string;
  getBestPriceLabel: string;
}) {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  return (
    <ProductsView
      locale={locale}
      category={category}
      products={products}
      categories={categories}
      counts={counts}
      homeLabel={homeLabel}
      productsLabel={productsLabel}
      getBestPriceLabel={getBestPriceLabel}
    />
  );
}
