import Link from 'next/link';
import { ChevronRight, Mail, MessageCircle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';
import SimilarProducts from '@/components/product/SimilarProducts';
import ImageGallery from '@/components/product/ImageGallery';
import { fetchApi } from '@/lib/api-data';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id: slug } = await params;
  const tt = await getTranslations({ locale, namespace: 'common' });

  const product = await fetchApi(`/products/${slug}`);
  if (!product) notFound();

  const related = (await fetchApi(`/products/${slug}/related?limit=10`)) || [];

  const name = product.name_en || '';
  const images: string[] = product.images ? JSON.parse(product.images || '[]') : [];
  if (!images.length && product.image) images.push(product.image);
  const categorySlug = product.category_slug || '';
  const descriptionHtml = product.description_en || '';

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b">
        <div className="max-w-[1200px] mx-auto px-4 py-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 flex-wrap">
            <Link href={`/${locale}`} className="hover:text-brand-red">{tt('home')}</Link>
            <ChevronRight size={12} />
            <Link href={`/${locale}/products`} className="hover:text-brand-red">{tt('products')}</Link>
            {categorySlug && (
              <>
                <ChevronRight size={12} />
                <Link href={`/${locale}/products?category=${categorySlug}`} className="hover:text-brand-red">
                  {categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                </Link>
              </>
            )}
            <ChevronRight size={12} />
            <span className="text-gray-700">{name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="grid md:grid-cols-[1fr_1fr] gap-8">
          <ImageGallery images={images} alt={name} />

          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-6">{name}</h1>

            {product.price && (
              <p className="text-xl font-bold text-brand-red mb-4">{product.price}</p>
            )}

            <div className="flex flex-col gap-3">
              <button className="flex items-center justify-center gap-2 bg-gradient-to-b from-[#ff8a3d] to-[#e6731a] text-white px-6 py-3.5 rounded font-semibold hover:from-[#e6731a] hover:to-[#cc5f0a] transition text-base">
                <Mail size={18} />
                {tt('getBestPrice')}
              </button>
              <button className="flex items-center justify-center gap-2 bg-gradient-to-b from-[#4caf50] to-[#388e3c] text-white px-6 py-3 rounded font-semibold hover:from-[#388e3c] hover:to-[#2e7d32] transition text-sm">
                <MessageCircle size={16} />
                Chat Now
              </button>
            </div>
          </div>
        </div>

        {descriptionHtml && (
          <div className="mt-12 border rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 border-b">
              Product Description
            </div>
            <div
              className="p-6 text-sm text-gray-600 leading-relaxed description-content"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(descriptionHtml) }}
            />
          </div>
        )}

        <SimilarProducts locale={locale} products={related.map((r: any) => ({
          id: r.id,
          slug: r.slug,
          name_en: r.name?.en || '',
          image: r.image || '',
        }))} />
      </div>
    </div>
  );
}
