import { fetchApi, flatProduct } from '@/lib/api-data';
import Banner from '@/components/home/Banner';
import HotProducts from '@/components/home/HotProducts';
import AboutSection from '@/components/home/AboutSection';
import NewsSection from '@/components/home/NewsSection';
import TopSelling from '@/components/home/TopSelling';
import MoreProducts from '@/components/home/MoreProducts';
import ContactSection from '@/components/home/ContactSection';
import Partners from '@/components/home/Partners';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const featured = (await fetchApi('/products?featured=1')).map(flatProduct);

  return (
    <>
      <Banner locale={locale} />
      <HotProducts locale={locale} products={featured} />
      <AboutSection locale={locale} />
      <NewsSection locale={locale} />
      <TopSelling locale={locale} />
      <MoreProducts locale={locale} />
      <ContactSection locale={locale} />
      <Partners locale={locale} />
    </>
  );
}
