import { fetchApi, flatProduct } from '@/lib/api-data';
import { categories as categoriesData } from '@/data/categories';
import Link from 'next/link';
import { ChevronRight, Filter } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category } = await searchParams;
  const tt = await getTranslations({ locale, namespace: 'common' });

  const products = (await fetchApi(`/products${category ? '?category=' + category : ''}`)).map(flatProduct);

  const categories = categoriesData.map(c => ({
    slug: c.slug,
    name_en: (c.name as Record<string, string>)['en'] || c.slug,
  }));

  const currentCategory = category ? categories.find(c => c.slug === category) : null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href={`/${locale}`} className="hover:text-brand-red">{tt('home')}</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">
              {currentCategory ? currentCategory.name_en : tt('products')}
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
                </Link>
                {categories.map(cat => (
                  <Link key={cat.slug} href={`/${locale}/products?category=${cat.slug}`}
                    className={`flex items-center justify-between px-4 py-2.5 text-sm transition ${category === cat.slug ? 'bg-red-50 text-brand-red font-semibold border-r-2 border-brand-red' : 'text-gray-700 hover:bg-gray-50'}`}>
                    <span className="line-clamp-1">{cat.name_en}</span>
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
              <Link href={`/${locale}/products`} className={`block px-4 py-2.5 text-sm ${!category ? 'bg-red-50 text-brand-red font-semibold' : 'text-gray-700'}`}>All Products</Link>
              {categories.map(cat => (
                <Link key={cat.slug} href={`/${locale}/products?category=${cat.slug}`}
                  className={`block px-4 py-2.5 text-sm ${category === cat.slug ? 'bg-red-50 text-brand-red font-semibold' : 'text-gray-700'}`}>
                  {cat.name_en}
                </Link>
              ))}
            </div>
          </details>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">
                {currentCategory ? currentCategory.name_en : tt('products')}
              </h1>
              <span className="text-sm text-gray-500">{products.length} products</span>
            </div>
            {products.length === 0 ? (
              <div className="text-center py-20 text-gray-400">No products found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product: any) => (
                  <Link key={product.id} href={`/${locale}/products/${product.slug}`}
                    className="group bg-white rounded-lg border overflow-hidden hover:shadow-lg transition flex flex-col">
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      <img src={product.image || '/images/load_icon.gif'}
                        alt={product.name_en} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-sm font-medium line-clamp-2 mb-2 group-hover:text-brand-red transition flex-1">
                        {product.name_en}
                      </h3>
                      {product.price && <p className="text-brand-red font-bold text-lg mb-3">{product.price}</p>}
                      <div className="flex items-center justify-between text-brand-red text-sm font-semibold pt-3 border-t">
                        <span>{tt('getBestPrice')}</span>
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
