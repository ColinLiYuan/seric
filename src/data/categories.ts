export interface Category {
  id: string;
  slug: string;
  name: Record<string, string>;
  description?: Record<string, string>;
}

// Category name translations for all 22 languages (from original site where available, else machine translated)
const t = (en: string, zh: string, fr: string, de: string, it: string, ru: string, es: string, pt: string, nl: string, el: string, ja: string, ko: string, ar: string, hi: string, tr: string, id: string, vi: string, th: string, bn: string, fa: string, pl: string) =>
  ({ en, zh, fr, de, it, ru, es, pt, nl, el, ja, ko, ar, hi, tr, id, vi, th, bn, fa, pl });

export const categories: Category[] = [
  {
    id: 'hydraulic-vane-pump',
    slug: 'hydraulic-vane-pump',
    name: t(
      'Hydraulic Vane Pump', '液压叶片泵',
      'Pompe à palettes hydraulique', 'Hydraulische Flügelzellenpumpe',
      'Pompa idraulica a palette', 'Гидравлический лопастной насос',
      'Bomba hidráulica de paletas', 'Bomba hidráulica de palhetas',
      'Hydraulische schottenpomp', 'Υδραυλική αντλία πτερυγίων',
      '油圧ベーンポンプ', '유압 베인 펌프',
      'مضخة ريشة هيدروليكية', 'हाइड्रोलिक फलक पंप',
      'Hidrolik kanatlı pompa', 'Pompa baling-baling hidrolik',
      'Bơm cánh gạt thủy lực', 'ปั๊มใบพัดไฮดรอลิก',
      'হাইড্রোলিক ভ্যান পাম্প', 'پمپ پره‌ای هیدرولیک',
      'Hydrauliczna pompa łopatkowa'
    ),
  },
  {
    id: 'hydraulic-piston-pump',
    slug: 'hydraulic-piston-pump',
    name: t(
      'Hydraulic Piston Pump', '液压柱塞泵',
      'Pompe à piston hydraulique', 'Hydraulikkolbenpumpe',
      'Pompa idraulica a pistoni', 'Гидравлический поршневой насос',
      'Bomba de pistón hidráulico', 'Bomba de pistão hidráulico',
      'Hydraulische zuigerpomp', 'Υδραυλική αντλία εμβόλου',
      '油圧ピストンポンプ', '유압 피스톤 펌프',
      'مضخة مكبس هيدروليكية', 'हाइड्रोलिक पिस्टन पंप',
      'Hidrolik pistonlu pompa', 'Pompa piston hidrolik',
      'Bơm pít-tông thủy lực', 'ปั๊มลูกสูบไฮดรอลิก',
      'হাইড্রোলিক পিস্টন পাম্প', 'پمپ پیستونی هیدرولیک',
      'Hydrauliczna pompa tłokowa'
    ),
  },
  {
    id: 'solenoid-directional-control-valve',
    slug: 'solenoid-directional-control-valve',
    name: t(
      'Solenoid Directional Control Valve', '电磁换向阀',
      'Valve de commande directionnelle à solénoïde', 'Magnet-Wegeventil',
      'Valvola di controllo direzionale a solenoide', 'Соленоидный распределительный клапан',
      'Válvula de control direccional de solenoide', 'Válvula de controle direcional solenoide',
      'Magneetrichtingsklep', 'Ηλεκτρομαγνητική βαλβίδα ελέγχου κατεύθυνσης',
      '電磁方向制御弁', '솔레노이드 방향 제어 밸브',
      'صمام التحكم الاتجاهي الكهرومغناطيسي', 'सोलेनॉइड दिशात्मक नियंत्रण वाल्व',
      'Solenoid yön kontrol valfi', 'Katup kontrol arah solenoid',
      'Van điều khiển hướng điện từ', 'โซลินอยด์วาล์วควบคุมทิศทาง',
      'সোলেনয়েড ডিরেকশনাল কন্ট্রোল ভালভ', 'شیر کنترل جهت سلونوئیدی',
      'Zawór sterowania kierunkowego elektromagnetyczny'
    ),
  },
  {
    id: 'hydraulic-orbit-motor',
    slug: 'hydraulic-orbit-motor',
    name: t(
      'Hydraulic Orbit Motor', '液压摆线马达',
      'Moteur orbital hydraulique', 'Hydraulischer Orbitmotor',
      'Motore orbitale idraulico', 'Гидравлический орбитальный мотор',
      'Motor orbital hidráulico', 'Motor orbital hidráulico',
      'Hydraulische orbitmotor', 'Υδραυλικός τροχιακός κινητήρας',
      '油圧軌道モーター', '유압 궤도 모터',
      'محرك مداري هيدروليكي', 'हाइड्रोलिक ऑर्बिट मोटर',
      'Hidrolik orbit motoru', 'Motor orbit hidrolik',
      'Động cơ quỹ đạo thủy lực', 'มอเตอร์ไฮดรอลิกแบบโคจร',
      'হাইড্রোলিক অরবিট মোটর', 'موتور مداری هیدرولیک',
      'Hydrauliczny silnik orbitalny'
    ),
  },
  {
    id: 'hydraulic-modular-valve',
    slug: 'hydraulic-modular-valve',
    name: t(
      'Hydraulic Modular Valve', '液压叠加阀',
      'Valve modulaire hydraulique', 'Hydraulisches Modularventil',
      'Valvola modulare idraulica', 'Гидравлический модульный клапан',
      'Válvula modular hidráulica', 'Válvula modular hidráulica',
      'Hydraulische modulaire klep', 'Υδραυλική σπονδυλωτή βαλβίδα',
      '油圧モジュラーバルブ', '유압 모듈러 밸브',
      'صمام هيدروليكي معياري', 'हाइड्रोलिक मॉड्यूलर वाल्व',
      'Hidrolik modüler valf', 'Katup modular hidrolik',
      'Van mô-đun thủy lực', 'วาล์วไฮดรอลิกแบบโมดูลาร์',
      'হাইড্রোলিক মডুলার ভালভ', 'شیر مدولار هیدرولیک',
      'Hydrauliczny zawór modułowy'
    ),
  },
  {
    id: 'hydraulic-gear-pump',
    slug: 'hydraulic-gear-pump',
    name: t(
      'Hydraulic Gear Pump', '液压齿轮泵',
      'Pompe à engrenages hydraulique', 'Hydraulische Zahnradpumpe',
      'Pompa idraulica a ingranaggi', 'Гидравлический шестеренчатый насос',
      'Bomba de engranajes hidráulica', 'Bomba de engrenagens hidráulica',
      'Hydraulische tandwielpomp', 'Υδραυλική αντλία γραναζιών',
      '油圧ギヤポンプ', '유압 기어 펌프',
      'مضخة تروس هيدروليكية', 'हाइड्रोलिक गियर पंप',
      'Hidrolik dişli pompa', 'Pompa roda gigi hidrolik',
      'Bơm bánh răng thủy lực', 'ปั๊มเกียร์ไฮดรอลิก',
      'হাইড্রোলিক গিয়ার পাম্প', 'پمپ دنده‌ای هیدرولیک',
      'Hydrauliczna pompa zębata'
    ),
  },
  {
    id: 'manual-directional-control-valve',
    slug: 'manual-directional-control-valve',
    name: t(
      'Manual Directional Control Valve', '手动换向阀',
      'Valve de commande directionnelle manuelle', 'Hand-Wegeventil',
      'Valvola di controllo direzionale manuale', 'Ручной распределительный клапан',
      'Válvula de control direccional manual', 'Válvula de controle direcional manual',
      'Handmatige richtingsklep', 'Χειροκίνητη βαλβίδα ελέγχου κατεύθυνσης',
      '手動方向制御弁', '수동 방향 제어 밸브',
      'صمام التحكم الاتجاهي اليدوي', 'मैनुअल दिशात्मक नियंत्रण वाल्व',
      'Manuel yön kontrol valfi', 'Katup kontrol arah manual',
      'Van điều khiển hướng bằng tay', 'วาล์วควบคุมทิศทางแบบแมนนวล',
      'ম্যানুয়াল ডিরেকশনাল কন্ট্রোল ভালভ', 'شیر کنترل جهت دستی',
      'Ręczny zawór sterowania kierunkowego'
    ),
  },
  {
    id: 'hydraulic-lift-valve',
    slug: 'hydraulic-lift-valve',
    name: t(
      'Hydraulic Lift Valve', '液压升降阀',
      'Valve de levage hydraulique', 'Hydraulisches Hubventil',
      'Valvola di sollevamento idraulica', 'Гидравлический подъемный клапан',
      'Válvula de elevación hidráulica', 'Válvula de elevação hidráulica',
      'Hydraulische hefklep', 'Υδραυλική βαλβίδα ανύψωσης',
      '油圧リフトバルブ', '유압 리프트 밸브',
      'صمام رفع هيدروليكي', 'हाइड्रोलिक लिफ्ट वाल्व',
      'Hidrolik kaldırma valfi', 'Katup angkat hidrolik',
      'Van nâng thủy lực', 'วาล์วยกไฮดรอลิก',
      'হাইড্রোলিক লিফট ভালভ', 'شیر بالابر هیدرولیک',
      'Hydrauliczny zawór podnośnikowy'
    ),
  },
  {
    id: 'hydraulic-pressure-control-valve',
    slug: 'hydraulic-pressure-control-valve',
    name: t(
      'Hydraulic Pressure Control Valve', '液压压力控制阀',
      'Valve de contrôle de pression hydraulique', 'Hydraulisches Druckregelventil',
      'Valvola di controllo pressione idraulica', 'Гидравлический клапан контроля давления',
      'Válvula de control de presión hidráulica', 'Válvula de controle de pressão hidráulica',
      'Hydraulische drukregelklep', 'Υδραυλική βαλβίδα ελέγχου πίεσης',
      '油圧圧力制御弁', '유압 압력 제어 밸브',
      'صمام التحكم في الضغط الهيدروليكي', 'हाइड्रोलिक प्रेशर कंट्रोल वाल्व',
      'Hidrolik basınç kontrol valfi', 'Katup kontrol tekanan hidrolik',
      'Van điều khiển áp suất thủy lực', 'วาล์วควบคุมแรงดันไฮดรอลิก',
      'হাইড্রোলিক প্রেসার কন্ট্রোল ভালভ', 'شیر کنترل فشار هیدرولیک',
      'Hydrauliczny zawór kontroli ciśnienia'
    ),
  },
  {
    id: 'hydraulic-flow-control-valve',
    slug: 'hydraulic-flow-control-valve',
    name: t(
      'Hydraulic Flow Control Valve', '液压流量控制阀',
      'Valve de contrôle de débit hydraulique', 'Hydraulisches Stromregelventil',
      'Valvola di controllo flusso idraulica', 'Гидравлический клапан контроля потока',
      'Válvula de control de flujo hidráulica', 'Válvula de controle de fluxo hidráulica',
      'Hydraulische stroomregelklep', 'Υδραυλική βαλβίδα ελέγχου ροής',
      '油圧流量制御弁', '유압 유량 제어 밸브',
      'صمام التحكم في التدفق الهيدروليكي', 'हाइड्रोलिक फ्लो कंट्रोल वाल्व',
      'Hidrolik akış kontrol valfi', 'Katup kontrol aliran hidrolik',
      'Van điều khiển lưu lượng thủy lực', 'วาล์วควบคุมการไหลไฮดรอลิก',
      'হাইড্রোলিক ফ্লো কন্ট্রোল ভালভ', 'شیر کنترل جریان هیدرولیک',
      'Hydrauliczny zawór kontroli przepływu'
    ),
  },
  {
    id: 'hydraulic-proportional-valve',
    slug: 'hydraulic-proportional-valve',
    name: t(
      'Hydraulic Proportional Valve', '液压比例阀',
      'Valve proportionnelle hydraulique', 'Hydraulisches Proportionalventil',
      'Valvola proporzionale idraulica', 'Гидравлический пропорциональный клапан',
      'Válvula proporcional hidráulica', 'Válvula proporcional hidráulica',
      'Hydraulische proportionele klep', 'Υδραυλική αναλογική βαλβίδα',
      '油圧比例弁', '유압 비례 밸브',
      'صمام تناسبي هيدروليكي', 'हाइड्रोलिक प्रोपोर्शनल वाल्व',
      'Hidrolik oransal valf', 'Katup proporsional hidrolik',
      'Van tỷ lệ thủy lực', 'วาล์วสัดส่วนไฮดรอลิก',
      'হাইড্রোলিক প্রোপোরশনাল ভালভ', 'شیر تناسبی هیدرولیک',
      'Hydrauliczny zawór proporcjonalny'
    ),
  },
  {
    id: 'hydraulic-power-unit',
    slug: 'hydraulic-power-unit',
    name: t(
      'Hydraulic Power Unit', '液压动力单元',
      'Groupe hydraulique', 'Hydraulikaggregat',
      'Unità di potenza idraulica', 'Гидравлический силовой агрегат',
      'Unidad de potencia hidráulica', 'Unidade de potência hidráulica',
      'Hydraulische krachtbron', 'Υδραυλική μονάδα ισχύος',
      '油圧パワーユニット', '유압 파워 유닛',
      'وحدة طاقة هيدروليكية', 'हाइड्रोलिक पावर यूनिट',
      'Hidrolik güç ünitesi', 'Unit daya hidrolik',
      'Bộ nguồn thủy lực', 'ชุดจ่ายกำลังไฮดรอลิก',
      'হাইড্রোলিক পাওয়ার ইউনিট', 'واحد قدرت هیدرولیک',
      'Hydrauliczny zespół napędowy'
    ),
  },
  {
    id: 'hydraulic-cylinder',
    slug: 'hydraulic-cylinder',
    name: t(
      'Hydraulic Cylinder', '液压油缸',
      'Vérin hydraulique', 'Hydraulikzylinder',
      'Cilindro idraulico', 'Гидравлический цилиндр',
      'Cilindro hidráulico', 'Cilindro hidráulico',
      'Hydraulische cilinder', 'Υδραυλικός κύλινδρος',
      '油圧シリンダー', '유압 실린더',
      'أسطوانة هيدروليكية', 'हाइड्रोलिक सिलेंडर',
      'Hidrolik silindir', 'Silinder hidrolik',
      'Xi lanh thủy lực', 'กระบอกสูบไฮดรอลิก',
      'হাইড্রোলিক সিলিন্ডার', 'سیلندر هیدرولیک',
      'Siłownik hydrauliczny'
    ),
  },
  {
    id: 'material-handling-equipment',
    slug: 'material-handling-equipment',
    name: t(
      'Material Handling Equipment', '物料搬运设备',
      'Équipement de manutention', 'Fördertechnik',
      'Attrezzatura per movimentazione', 'Оборудование для погрузки-разгрузки',
      'Equipo de manipulación de materiales', 'Equipamento de movimentação',
      'Materiaalbehandelingsapparatuur', 'Εξοπλισμός διακίνησης υλικών',
      'マテリアルハンドリング装置', '자재 취급 장비',
      'معدات مناولة المواد', 'सामग्री हैंडलिंग उपकरण',
      'Malzeme taşıma ekipmanı', 'Peralatan penanganan material',
      'Thiết bị xử lý vật liệu', 'อุปกรณ์ขนถ่ายวัสดุ',
      'ম্যাটেরিয়াল হ্যান্ডলিং ইকুইপমেন্ট', 'تجهیزات جابجایی مواد',
      'Sprzęt do transportu materiałów'
    ),
  },
];
