import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import SimilarProducts from '@/components/product/SimilarProducts';
import ImageGallery from '@/components/product/ImageGallery';
import ActionButtons from '@/components/product/ActionButtons';
import DescriptionHtml from '@/components/product/DescriptionHtml';
import { fetchApi } from '@/lib/api-data';

const CDN = 'https://pub-81f2ee8c38ae4937a81a67bd0db6be8e.r2.dev';
function preImg(p: string) { if (!p) return ''; if (p.startsWith('http')) return p; return CDN + '/' + p; }

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }) {
  try {
    const { id: slug } = await params;
    const product = await fetchApi(`/products/${slug}`);
    if (!product) return { title: 'Product Not Found' };
    const name = product.name?.en || product.name_en || product.slug;
    return {
      title: name,
      description: (product.description?.en || '').replace(/<[^>]+>/g, '').substring(0, 160),
      openGraph: {
        title: name,
        description: (product.description?.en || '').replace(/<[^>]+>/g, '').substring(0, 160),
        images: [product.image?.startsWith('http') ? product.image : `https://pub-81f2ee8c38ae4937a81a67bd0db6be8e.r2.dev/${product.image}`],
      },
    };
  } catch {
    return { title: 'Product Details' };
  }
}

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

  const name = product.name?.en || product.name_en || '';
  const images: string[] = Array.isArray(product.images) ? product.images.map(preImg) : [];
  if (!images.length && product.image) images.push(preImg(product.image));
  const categorySlug = product.categorySlug || product.category_slug || '';
  const descriptionHtml = (product.description?.en || product.description_en || '')
    .replace(/src=\"products\/load_icon\.gif\"[^>]*data-original=\"([^\"]+)\"[^>]*>/g, '<img src=\"'+CDN+'/$1\">')
    .replace(/src=\"products\/(?!load_icon)/g, 'src=\"'+CDN+'/products/')
    .replace(/<\/h2>,/g, '</h2>')
    .replace(/Tags:\s*/g, '')
    .replace(/<div class="product_cont_p_99713">[\s\S]*$/, '');
  const categoryName = product.categoryName?.en || '';

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
                  {categoryName || categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
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

            <ActionButtons
              getBestPriceText={tt('getBestPrice')}
              productSlug={slug}
              productName={name}
            />
          </div>
        </div>

        <DescriptionHtml html={descriptionHtml} />

        <SimilarProducts locale={locale} products={related.map((r: any) => ({
          id: r.id,
          slug: r.slug,
          name_en: r.name?.en || '',
          image: preImg(r.image || ''),
        }))} />
      </div>
    </div>
  );
}
