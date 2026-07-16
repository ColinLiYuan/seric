// Extract translations from original site HTML and fill gaps
// Usage: node scripts/extract-translations.js

const fs = require('fs');
const path = require('path');

// Map language names from original site to locale codes
const langMap = {
  french: 'fr', german: 'de', italian: 'it', russian: 'ru',
  spanish: 'es', portuguese: 'pt', dutch: 'nl', greek: 'el',
  japanese: 'ja', korean: 'ko', arabic: 'ar', hindi: 'hi',
  turkish: 'tr', indonesian: 'id', vietnamese: 'vi', thai: 'th',
  bengali: 'bn', persian: 'fa', polish: 'pl',
};

// Machine-translated fallbacks for common UI strings
const commonTranslations = {
  fr: { home: 'Accueil', products: 'Produits', about: 'À propos de nous', contact: 'Contactez-nous', news: 'Nouvelles', cases: 'Cas', quote: 'Devis', search: 'Rechercher...', readMore: 'Lire la suite', viewAll: 'Voir tout', submit: 'Soumettre', send: 'Envoyer', privacy: 'Politique de confidentialité', sitemap: 'Plan du site', allRightsReserved: 'Tous droits réservés', getBestPrice: 'Obtenez le meilleur prix', contactUs: 'Contactez-nous', more: 'Plus de produits', language: 'Langue', getQuote: 'Obtenir un devis' },
  de: { home: 'Startseite', products: 'Produkte', about: 'Über uns', contact: 'Kontakt', news: 'Nachrichten', cases: 'Fälle', quote: 'Angebot', search: 'Suchen...', readMore: 'Weiterlesen', viewAll: 'Alle anzeigen', submit: 'Absenden', send: 'Senden', privacy: 'Datenschutz', sitemap: 'Sitemap', allRightsReserved: 'Alle Rechte vorbehalten', getBestPrice: 'Bestpreis erhalten', contactUs: 'Kontaktieren Sie uns', more: 'Weitere Produkte', language: 'Sprache', getQuote: 'Angebot einholen' },
  it: { home: 'Casa', products: 'Prodotti', about: 'Chi siamo', contact: 'Contattaci', news: 'Notizie', cases: 'Casi', quote: 'Citazione', search: 'Cerca...', readMore: 'Leggi di più', viewAll: 'Vedi tutto', submit: 'Invia', send: 'Invia', privacy: 'Privacy', sitemap: 'Mappa del sito', allRightsReserved: 'Tutti i diritti riservati', getBestPrice: 'Ottieni il miglior prezzo', contactUs: 'Contattaci', more: 'Altri prodotti', language: 'Lingua', getQuote: 'Ottieni un preventivo' },
  ru: { home: 'Главная', products: 'Продукты', about: 'О нас', contact: 'Контакты', news: 'Новости', cases: 'Кейсы', quote: 'Котировка', search: 'Поиск...', readMore: 'Читать далее', viewAll: 'Смотреть все', submit: 'Отправить', send: 'Отправить', privacy: 'Конфиденциальность', sitemap: 'Карта сайта', allRightsReserved: 'Все права защищены', getBestPrice: 'Получить лучшую цену', contactUs: 'Свяжитесь с нами', more: 'Больше продуктов', language: 'Язык', getQuote: 'Получить предложение' },
  es: { home: 'Inicio', products: 'Productos', about: 'Sobre nosotros', contact: 'Contáctenos', news: 'Noticias', cases: 'Casos', quote: 'Cotización', search: 'Buscar...', readMore: 'Leer más', viewAll: 'Ver todo', submit: 'Enviar', send: 'Enviar', privacy: 'Privacidad', sitemap: 'Mapa del sitio', allRightsReserved: 'Todos los derechos reservados', getBestPrice: 'Obtener el mejor precio', contactUs: 'Contáctenos', more: 'Más productos', language: 'Idioma', getQuote: 'Solicitar cotización' },
  pt: { home: 'Início', products: 'Produtos', about: 'Sobre nós', contact: 'Contate-nos', news: 'Notícias', cases: 'Casos', quote: 'Cotação', search: 'Pesquisar...', readMore: 'Leia mais', viewAll: 'Ver tudo', submit: 'Enviar', send: 'Enviar', privacy: 'Privacidade', sitemap: 'Mapa do site', allRightsReserved: 'Todos os direitos reservados', getBestPrice: 'Obter o melhor preço', contactUs: 'Contate-nos', more: 'Mais produtos', language: 'Idioma', getQuote: 'Solicitar cotação' },
  nl: { home: 'Thuis', products: 'Producten', about: 'Over ons', contact: 'Neem contact op', news: 'Nieuws', cases: 'Cases', quote: 'Offerte', search: 'Zoeken...', readMore: 'Lees meer', viewAll: 'Alles bekijken', submit: 'Indienen', send: 'Verzenden', privacy: 'Privacybeleid', sitemap: 'Sitemap', allRightsReserved: 'Alle rechten voorbehouden', getBestPrice: 'Krijg de beste prijs', contactUs: 'Neem contact op', more: 'Meer producten', language: 'Taal', getQuote: 'Offerte aanvragen' },
  el: { home: 'Αρχική', products: 'Προϊόντα', about: 'Σχετικά', contact: 'Επικοινωνία', news: 'Νέα', cases: 'Περιπτώσεις', quote: 'Προσφορά', search: 'Αναζήτηση...', readMore: 'Διαβάστε περισσότερα', viewAll: 'Δείτε όλα', submit: 'Υποβολή', send: 'Αποστολή', privacy: 'Απόρρητο', sitemap: 'Χάρτης ιστότοπου', allRightsReserved: 'Με την επιφύλαξη παντός δικαιώματος', getBestPrice: 'Λάβετε την καλύτερη τιμή', contactUs: 'Επικοινωνήστε μαζί μας', more: 'Περισσότερα προϊόντα', language: 'Γλώσσα', getQuote: 'Λάβετε προσφορά' },
  ja: { home: 'ホーム', products: '製品', about: '私たちについて', contact: 'お問い合わせ', news: 'ニュース', cases: '事例', quote: '見積もり', search: '検索...', readMore: '続きを読む', viewAll: 'すべて表示', submit: '送信', send: '送信', privacy: 'プライバシーポリシー', sitemap: 'サイトマップ', allRightsReserved: '全著作権所有', getBestPrice: '最安値を取得', contactUs: 'お問い合わせ', more: 'その他の製品', language: '言語', getQuote: '見積もりを取得' },
  ko: { home: '홈', products: '제품', about: '회사 소개', contact: '연락처', news: '뉴스', cases: '사례', quote: '견적', search: '검색...', readMore: '더 읽기', viewAll: '모두 보기', submit: '제출', send: '보내기', privacy: '개인정보처리방침', sitemap: '사이트맵', allRightsReserved: '모든 권리 보유', getBestPrice: '최적가 받기', contactUs: '문의하기', more: '더 많은 제품', language: '언어', getQuote: '견적 받기' },
  ar: { home: 'الرئيسية', products: 'المنتجات', about: 'من نحن', contact: 'اتصل بنا', news: 'أخبار', cases: 'حالات', quote: 'اقتباس', search: 'بحث...', readMore: 'اقرأ المزيد', viewAll: 'عرض الكل', submit: 'إرسال', send: 'إرسال', privacy: 'سياسة الخصوصية', sitemap: 'خريطة الموقع', allRightsReserved: 'جميع الحقوق محفوظة', getBestPrice: 'احصل على أفضل سعر', contactUs: 'اتصل بنا', more: 'المزيد من المنتجات', language: 'اللغة', getQuote: 'احصل على عرض سعر' },
  hi: { home: 'होम', products: 'उत्पाद', about: 'हमारे बारे में', contact: 'संपर्क करें', news: 'समाचार', cases: 'मामले', quote: 'उद्धरण', search: 'खोजें...', readMore: 'और पढ़ें', viewAll: 'सभी देखें', submit: 'जमा करें', send: 'भेजें', privacy: 'गोपनीयता नीति', sitemap: 'साइटमैप', allRightsReserved: 'सर्वाधिकार सुरक्षित', getBestPrice: 'सर्वोत्तम मूल्य प्राप्त करें', contactUs: 'हमसे संपर्क करें', more: 'अधिक उत्पाद', language: 'भाषा', getQuote: 'कोटेशन प्राप्त करें' },
  tr: { home: 'Ana Sayfa', products: 'Ürünler', about: 'Hakkımızda', contact: 'İletişim', news: 'Haberler', cases: 'Vakalar', quote: 'Teklif', search: 'Ara...', readMore: 'Devamını oku', viewAll: 'Tümünü gör', submit: 'Gönder', send: 'Gönder', privacy: 'Gizlilik Politikası', sitemap: 'Site Haritası', allRightsReserved: 'Tüm hakları saklıdır', getBestPrice: 'En iyi fiyatı al', contactUs: 'Bize ulaşın', more: 'Daha fazla ürün', language: 'Dil', getQuote: 'Teklif al' },
  id: { home: 'Beranda', products: 'Produk', about: 'Tentang Kami', contact: 'Hubungi Kami', news: 'Berita', cases: 'Kasus', quote: 'Kutipan', search: 'Cari...', readMore: 'Baca selengkapnya', viewAll: 'Lihat semua', submit: 'Kirim', send: 'Kirim', privacy: 'Kebijakan Privasi', sitemap: 'Peta Situs', allRightsReserved: 'Hak cipta dilindungi', getBestPrice: 'Dapatkan harga terbaik', contactUs: 'Hubungi Kami', more: 'Produk lainnya', language: 'Bahasa', getQuote: 'Dapatkan penawaran' },
  vi: { home: 'Trang chủ', products: 'Sản phẩm', about: 'Về chúng tôi', contact: 'Liên hệ', news: 'Tin tức', cases: 'Trường hợp', quote: 'Báo giá', search: 'Tìm kiếm...', readMore: 'Đọc thêm', viewAll: 'Xem tất cả', submit: 'Gửi', send: 'Gửi', privacy: 'Chính sách bảo mật', sitemap: 'Sơ đồ trang', allRightsReserved: 'Đã đăng ký bản quyền', getBestPrice: 'Nhận giá tốt nhất', contactUs: 'Liên hệ với chúng tôi', more: 'Thêm sản phẩm', language: 'Ngôn ngữ', getQuote: 'Nhận báo giá' },
  th: { home: 'หน้าแรก', products: 'ผลิตภัณฑ์', about: 'เกี่ยวกับเรา', contact: 'ติดต่อเรา', news: 'ข่าวสาร', cases: 'กรณีศึกษา', quote: 'ใบเสนอราคา', search: 'ค้นหา...', readMore: 'อ่านเพิ่มเติม', viewAll: 'ดูทั้งหมด', submit: 'ส่ง', send: 'ส่ง', privacy: 'นโยบายความเป็นส่วนตัว', sitemap: 'แผนผังเว็บไซต์', allRightsReserved: 'สงวนลิขสิทธิ์', getBestPrice: 'รับราคาที่ดีที่สุด', contactUs: 'ติดต่อเรา', more: 'ผลิตภัณฑ์เพิ่มเติม', language: 'ภาษา', getQuote: 'ขอใบเสนอราคา' },
  bn: { home: 'হোম', products: 'পণ্য', about: 'আমাদের সম্পর্কে', contact: 'যোগাযোগ', news: 'খবর', cases: 'কেস', quote: 'উদ্ধৃতি', search: 'অনুসন্ধান...', readMore: 'আরও পড়ুন', viewAll: 'সব দেখুন', submit: 'জমা দিন', send: 'পাঠান', privacy: 'গোপনীয়তা নীতি', sitemap: 'সাইটম্যাপ', allRightsReserved: 'সর্বস্বত্ব সংরক্ষিত', getBestPrice: 'সেরা মূল্য পান', contactUs: 'আমাদের সাথে যোগাযোগ করুন', more: 'আরও পণ্য', language: 'ভাষা', getQuote: 'উদ্ধৃতি পান' },
  fa: { home: 'خانه', products: 'محصولات', about: 'درباره ما', contact: 'تماس با ما', news: 'اخبار', cases: 'موارد', quote: 'نقل قول', search: 'جستجو...', readMore: 'بیشتر بخوانید', viewAll: 'مشاهده همه', submit: 'ارسال', send: 'ارسال', privacy: 'حریم خصوصی', sitemap: 'نقشه سایت', allRightsReserved: 'تمام حقوق محفوظ است', getBestPrice: 'بهترین قیمت را دریافت کنید', contactUs: 'با ما تماس بگیرید', more: 'محصولات بیشتر', language: 'زبان', getQuote: 'دریافت پیش فاکتور' },
  pl: { home: 'Strona główna', products: 'Produkty', about: 'O nas', contact: 'Kontakt', news: 'Aktualności', cases: 'Przypadki', quote: 'Wycena', search: 'Szukaj...', readMore: 'Czytaj więcej', viewAll: 'Zobacz wszystko', submit: 'Wyślij', send: 'Wyślij', privacy: 'Polityka prywatności', sitemap: 'Mapa strony', allRightsReserved: 'Wszelkie prawa zastrzeżone', getBestPrice: 'Uzyskaj najlepszą cenę', contactUs: 'Skontaktuj się z nami', more: 'Więcej produktów', language: 'Język', getQuote: 'Uzyskaj wycenę' },
};

// Section headers extracted from original site HTML
const sectionHeaders = {
  fr: { hotProducts: 'PRODUITS CHAUDS', hotProductsDesc: 'Nous nous développons dans de nombreux domaines.', topSelling: 'TOP VENTES', news: 'Nouvelles', contactTitle: 'CONTACTEZ-NOUS À TOUT MOMENT', contactSubtitle: 'Que souhaitez-vous demander ?', partners: 'Clients et associés', moreProducts: 'Plus de produits' },
  de: { hotProducts: 'HEISSE PRODUKTE', hotProductsDesc: 'Wir wachsen in vielen Bereichen.', topSelling: 'TOP-VERKÄUFE', news: 'Nachrichten', contactTitle: 'KONTAKTIEREN SIE UNS JEDERZEIT', contactSubtitle: 'Was möchten Sie anfordern?', partners: 'Kunden u. Partner', moreProducts: 'Weitere Produkte' },
  it: { hotProducts: 'PRODOTTI CALDI', hotProductsDesc: 'Stiamo crescendo in molte aree.', topSelling: 'PIÙ VENDUTI', news: 'Notizie', contactTitle: 'CONTATTACI IN QUALSIASI MOMENTO', contactSubtitle: 'Cosa desideri richiedere?', partners: 'Clienti & partner', moreProducts: 'Altri prodotti' },
  ru: { hotProducts: 'ГОРЯЧИЕ ПРОДУКТЫ', hotProductsDesc: 'Мы растем во многих областях.', topSelling: 'ТОП ПРОДАЖ', news: 'Новости', contactTitle: 'СВЯЖИТЕСЬ С НАМИ В ЛЮБОЕ ВРЕМЯ', contactSubtitle: 'Что вы хотите запросить?', partners: 'Клиенты & партнеры', moreProducts: 'Больше продуктов' },
  es: { hotProducts: 'PRODUCTOS CALIENTES', hotProductsDesc: 'Estamos creciendo en muchas áreas.', topSelling: 'MÁS VENDIDOS', news: 'Noticias', contactTitle: 'CONTÁCTENOS EN CUALQUIER MOMENTO', contactSubtitle: '¿Qué le gustaría solicitar?', partners: 'Clientes y socios', moreProducts: 'Más productos' },
  pt: { hotProducts: 'PRODUTOS QUENTES', hotProductsDesc: 'Estamos crescendo em muitas áreas.', topSelling: 'MAIS VENDIDOS', news: 'Notícias', contactTitle: 'CONTATE-NOS A QUALQUER MOMENTO', contactSubtitle: 'O que você gostaria de solicitar?', partners: 'Clientes & sócios', moreProducts: 'Mais produtos' },
  nl: { hotProducts: 'HETE PRODUCTEN', hotProductsDesc: 'We groeien op veel gebieden.', topSelling: 'TOP VERKOPEN', news: 'Nieuws', contactTitle: 'NEEM OP ELK MOMENT CONTACT MET ONS OP', contactSubtitle: 'Wat wilt u aanvragen?', partners: 'Klanten & Partners', moreProducts: 'Meer producten' },
  el: { hotProducts: 'ΚΑΥΤΑ ΠΡΟΪΟΝΤΑ', hotProductsDesc: 'Αναπτυσσόμαστε σε πολλούς τομείς.', topSelling: 'ΚΟΡΥΦΑΙΕΣ ΠΩΛΗΣΕΙΣ', news: 'Νέα', contactTitle: 'ΕΠΙΚΟΙΝΩΝΗΣΤΕ ΜΑΖΙ ΜΑΣ ΑΝΑ ΠΑΣΑ ΣΤΙΓΜΗ', contactSubtitle: 'Τι θα θέλατε να ζητήσετε;', partners: 'Πελάτες & συνεργάτες', moreProducts: 'Περισσότερα προϊόντα' },
  ja: { hotProducts: '熱いプロダクト', hotProductsDesc: '私たちは多くの分野で成長しています。', topSelling: 'トップセールス', news: 'ニュース', contactTitle: 'いつでもお問い合わせください', contactSubtitle: '何をリクエストしますか？', partners: '顧客及びパートナー', moreProducts: 'その他の製品' },
  ko: { hotProducts: '뜨거운 제품', hotProductsDesc: '우리는 많은 분야에서 성장하고 있습니다.', topSelling: '최고 판매', news: '뉴스', contactTitle: '언제든지 문의하십시오', contactSubtitle: '무엇을 요청하시겠습니까?', partners: '고객 및 파트너', moreProducts: '더 많은 제품' },
  ar: { hotProducts: 'المنتجات الحارة', hotProductsDesc: 'نحن ننمو في العديد من المجالات.', topSelling: 'أعلى المبيعات', news: 'أخبار', contactTitle: 'اتصل بنا في أي وقت', contactSubtitle: 'ماذا تود أن تطلب؟', partners: 'العملاء والشركاء', moreProducts: 'المزيد من المنتجات' },
  hi: { hotProducts: 'गर्म उत्पाद', hotProductsDesc: 'हम कई क्षेत्रों में बढ़ रहे हैं।', topSelling: 'शीर्ष बिक्री', news: 'समाचार', contactTitle: 'किसी भी समय हमसे संपर्क करें', contactSubtitle: 'आप क्या अनुरोध करना चाहेंगे?', partners: 'ग्राहक और भागीदार', moreProducts: 'अधिक उत्पाद' },
  tr: { hotProducts: 'Sıcak ürünler', hotProductsDesc: 'Birçok alanda büyüyoruz.', topSelling: 'EN ÇOK SATANLAR', news: 'Haberler', contactTitle: 'İSTEDİĞİNİZ ZAMAN BİZİMLE İLETİŞİME GEÇİN', contactSubtitle: 'Ne talep etmek istersiniz?', partners: 'Müşteriler ve Ortaklar', moreProducts: 'Daha fazla ürün' },
  id: { hotProducts: 'Produk panas', hotProductsDesc: 'Kami berkembang di banyak bidang.', topSelling: 'PENJUALAN TERATAS', news: 'Berita', contactTitle: 'HUBUNGI KAMI KAPAN SAJA', contactSubtitle: 'Apa yang ingin Anda minta?', partners: 'Pelanggan & Mitra', moreProducts: 'Produk lainnya' },
  vi: { hotProducts: 'Sản phẩm nóng', hotProductsDesc: 'Chúng tôi đang phát triển trong nhiều lĩnh vực.', topSelling: 'BÁN CHẠY NHẤT', news: 'Tin tức', contactTitle: 'LIÊN HỆ VỚI CHÚNG TÔI BẤT CỨ LÚC NÀO', contactSubtitle: 'Bạn muốn yêu cầu điều gì?', partners: 'Khách hàng & Đối tác', moreProducts: 'Thêm sản phẩm' },
  th: { hotProducts: 'สินค้าร้อน', hotProductsDesc: 'เรากำลังเติบโตในหลายพื้นที่', topSelling: 'ขายดีที่สุด', news: 'ข่าวสาร', contactTitle: 'ติดต่อเราได้ตลอดเวลา', contactSubtitle: 'คุณต้องการขออะไร', partners: 'ลูกค้าและพันธมิตร', moreProducts: 'ผลิตภัณฑ์เพิ่มเติม' },
  bn: { hotProducts: 'গরম পণ্য', hotProductsDesc: 'আমরা অনেক ক্ষেত্রে বৃদ্ধি পাচ্ছি।', topSelling: 'শীর্ষ বিক্রয়', news: 'খবর', contactTitle: 'যেকোনো সময় আমাদের সাথে যোগাযোগ করুন', contactSubtitle: 'আপনি কি অনুরোধ করতে চান?', partners: 'গ্রাহক ও অংশীদার', moreProducts: 'আরও পণ্য' },
  fa: { hotProducts: 'محصولات گرم', hotProductsDesc: 'ما در بسیاری از زمینه‌ها در حال رشد هستیم.', topSelling: 'پرفروش‌ترین‌ها', news: 'اخبار', contactTitle: 'در هر زمان با ما تماس بگیرید', contactSubtitle: 'چه چیزی می‌خواهید درخواست کنید؟', partners: 'مشتریان و شرکا', moreProducts: 'محصولات بیشتر' },
  pl: { hotProducts: 'GORĄCE PRODUKTY', hotProductsDesc: 'Rozwijamy się w wielu obszarach.', topSelling: 'NAJLEPIEJ SPRZEDAJĄCE SIĘ', news: 'Aktualności', contactTitle: 'SKONTAKTUJ SIĘ Z NAMI W DOWOLNEJ CHWILI', contactSubtitle: 'Co chciałbyś zamówić?', partners: 'Klienci i Partnerzy', moreProducts: 'Więcej produktów' },
};

// Contact form translations
const contactForm = {
  fr: { yourName: 'Votre nom', yourEmail: 'Votre e-mail', yourPhone: 'Votre téléphone ou WhatsApp', yourCompany: 'Votre entreprise', yourMessage: 'Décrivez brièvement votre besoin', leaveMessage: 'Laissez un message', callBack: 'Nous vous rappellerons bientôt!', submitted: 'Soumis avec succès!', messageHint: 'Votre message doit contenir entre 20 et 3000 caractères!' },
  de: { yourName: 'Ihr Name', yourEmail: 'Ihre E-Mail', yourPhone: 'Ihr Telefon oder WhatsApp', yourCompany: 'Ihr Firmenname', yourMessage: 'Beschreiben Sie kurz Ihre Anforderung', leaveMessage: 'Hinterlassen Sie eine Nachricht', callBack: 'Wir rufen Sie bald zurück!', submitted: 'Erfolgreich eingereicht!', messageHint: 'Ihre Nachricht muss zwischen 20 und 3000 Zeichen lang sein!' },
};

// Company info translations (address, slogan) - mostly stay English, but slogan varies
const companyInfoTranslations = {
  fr: { slogan: 'Le plus grand fournisseur de R&D et de production de pompes à palettes hydrauliques en Chine', address: 'Room 211, No. 9, Wanyu Street, Huangpu District, Guangzhou City' },
  de: { slogan: 'Der größte F&E- und Produktionslieferant für hydraulische Flügelzellenpumpen in China', address: 'Room 211, No. 9, Wanyu Street, Huangpu District, Guangzhou City' },
};

// Build the translation JSON files
const enBase = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'i18n', 'messages', 'en.json'), 'utf8'));

const allLocales = ['fr', 'de', 'it', 'ru', 'es', 'pt', 'nl', 'el', 'ja', 'ko', 'ar', 'hi', 'tr', 'id', 'vi', 'th', 'bn', 'fa', 'pl', 'zh'];

for (const locale of allLocales) {
  const ct = commonTranslations[locale] || {};
  const sh = sectionHeaders[locale] || {};
  const cf = contactForm[locale] || {};
  const ci = companyInfoTranslations[locale] || {};

  const translation = {
    common: {
      home: ct.home || enBase.common.home,
      products: ct.products || enBase.common.products,
      about: ct.about || enBase.common.about,
      contact: ct.contact || enBase.common.contact,
      news: ct.news || enBase.common.news,
      cases: ct.cases || enBase.common.cases,
      quote: ct.quote || enBase.common.quote,
      search: ct.search || enBase.common.search,
      readMore: ct.readMore || enBase.common.readMore,
      viewAll: ct.viewAll || enBase.common.viewAll,
      submit: ct.submit || enBase.common.submit,
      send: ct.send || enBase.common.send,
      privacy: ct.privacy || enBase.common.privacy,
      sitemap: ct.sitemap || enBase.common.sitemap,
      allRightsReserved: ct.allRightsReserved || enBase.common.allRightsReserved,
      getBestPrice: ct.getBestPrice || enBase.common.getBestPrice,
      contactUs: ct.contactUs || enBase.common.contactUs,
      more: ct.more || enBase.common.more,
      language: ct.language || enBase.common.language,
      getQuote: ct.getQuote || enBase.common.getQuote,
    },
    header: {
      language: ct.language || enBase.header.language,
      getQuote: ct.getQuote || enBase.header.getQuote,
    },
    home: {
      hotProducts: sh.hotProducts || enBase.home.hotProducts,
      hotProductsDesc: sh.hotProductsDesc || enBase.home.hotProductsDesc,
      aboutUs: enBase.home.aboutUs,
      news: sh.news || enBase.home.news,
      topSelling: sh.topSelling || enBase.home.topSelling,
      moreProducts: sh.moreProducts || enBase.home.moreProducts,
      contactTitle: sh.contactTitle || enBase.home.contactTitle,
      contactSubtitle: sh.contactSubtitle || enBase.home.contactSubtitle,
      partners: sh.partners || enBase.home.partners,
    },
    product: {
      inquiry: ct.contactUs || enBase.product.inquiry,
      description: enBase.product.description,
      specification: enBase.product.specification,
      sendInquiry: ct.send || enBase.product.sendInquiry,
      category: enBase.product.category,
    },
    about: {
      companyProfile: enBase.about.companyProfile,
      certification: enBase.about.certification,
      factoryTour: enBase.about.factoryTour,
      qcProfile: enBase.about.qcProfile,
      yearEstablished: enBase.about.yearEstablished,
      exportPc: enBase.about.exportPc,
    },
    contact: {
      yourName: cf.yourName || enBase.contact.yourName,
      yourEmail: cf.yourEmail || enBase.contact.yourEmail,
      yourPhone: cf.yourPhone || enBase.contact.yourPhone,
      yourCompany: cf.yourCompany || enBase.contact.yourCompany,
      yourMessage: cf.yourMessage || enBase.contact.yourMessage,
      leaveMessage: cf.leaveMessage || enBase.contact.leaveMessage,
      callBack: cf.callBack || enBase.contact.callBack,
      submitted: cf.submitted || enBase.contact.submitted,
      messageHint: cf.messageHint || enBase.contact.messageHint,
    },
    footer: {
      slogan: ci.slogan || enBase.footer.slogan,
      address: ci.address || enBase.footer.address,
      email: enBase.footer.email,
      phone: enBase.footer.phone,
    },
  };

  const outPath = path.join(__dirname, '..', 'src', 'i18n', 'messages', `${locale}.json`);
  fs.writeFileSync(outPath, JSON.stringify(translation, null, 2), 'utf8');
  console.log(`Generated ${locale}.json`);
}

console.log('Done! All 19 non-English translation files generated.');
