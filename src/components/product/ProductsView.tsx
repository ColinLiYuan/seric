import Link from 'next/link';
import { ChevronRight, Filter } from 'lucide-react';

export type ProductsCategory = { slug: string; name_en: string };

export default function ProductsView({
  locale,
  category,
  products,
  categories,
  counts,
  homeLabel,
  productsLabel,
  getBestPriceLabel,
}: {
  locale: string;
  category: string | null;
  products: any[];
  categories: ProductsCategory[];
  counts: Record<string, number>;
  homeLabel: string;
  productsLabel: string;
  getBestPriceLabel: string;
}) {
  const filtered = category ? products.filter((p: any) => p.category_slug === category) : products;
  const currentCategory = category ? categories.find((c) => c.slug === category) : null;
  const totalAll = products.length;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href={`/${locale}`} className="hover:text-brand-red">{homeLabel}</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">
              {currentCategory ? currentCategory.name_en : productsLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border sticky top-24">
              <div className="px-4 py-3 border-b">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Filter size={18} /> Categories
                </h2>
              </div>
              <nav className="py-2">
                <Link href={`/${locale}/products`}
                  className={`flex items-center justify-between px-4 py-2.5 text-sm transition ${!category ? 'bg-red-50 text-brand-red font-semibold border-r-2 border-brand-red' : 'text-gray-700 hover:bg-gray-50'}`}>
                  All Products
                  <span className="text-xs text-gray-400">{totalAll}</span>
                </Link>
                {categories.map((cat) => (
                  <Link key={cat.slug} href={`/${locale}/products?category=${cat.slug}`}
                    className={`flex items-center justify-between px-4 py-2.5 text-sm transition ${category === cat.slug ? 'bg-red-50 text-brand-red font-semibold border-r-2 border-brand-red' : 'text-gray-700 hover:bg-gray-50'}`}>
                    <span className="line-clamp-1">{cat.name_en}</span>
                    <span className="text-xs text-gray-400 ml-2">{counts[cat.slug] || 0}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          <details className="lg:hidden w-full mb-4">
            <summary className="flex items-center gap-2 bg-white border rounded-lg px-4 py-3 cursor-pointer font-medium">
              <Filter size={18} />
              {currentCategory ? currentCategory.name_en : 'All Categories'}
              <ChevronRight size={14} className="ml-auto" />
            </summary>
            <div className="bg-white border border-t-0 rounded-b-lg overflow-hidden">
              <Link href={`/${locale}/products`} className={`block px-4 py-2.5 text-sm ${!category ? 'bg-red-50 text-brand-red font-semibold' : 'text-gray-700'}`}>All Products ({totalAll})</Link>
              {categories.map((cat) => (
                <Link key={cat.slug} href={`/${locale}/products?category=${cat.slug}`}
                  className={`block px-4 py-2.5 text-sm ${category === cat.slug ? 'bg-red-50 text-brand-red font-semibold' : 'text-gray-700'}`}>
                  {cat.name_en} ({counts[cat.slug] || 0})
                </Link>
              ))}
            </div>
          </details>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">
                {currentCategory ? currentCategory.name_en : productsLabel}
              </h1>
              <span className="text-sm text-gray-500">{filtered.length} products</span>
            </div>
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">No products found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((product: any) => (
                  <Link key={product.id} href={`/${locale}/products/${product.slug}`}
                    className="group bg-white rounded-lg border overflow-hidden hover:shadow-lg transition flex flex-col">
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      <img src={product.image || 'https://pub-81f2ee8c38ae4937a81a67bd0db6be8e.r2.dev/products/load_icon.gif'}
                        alt={product.name_en} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-sm font-medium line-clamp-2 mb-2 group-hover:text-brand-red transition flex-1">
                        {product.name_en}
                      </h3>
                      {product.price && <p className="text-brand-red font-bold text-lg mb-3">{product.price}</p>}
                      <div className="flex items-center justify-between text-brand-red text-sm font-semibold pt-3 border-t">
                        <span>{getBestPriceLabel}</span>
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
