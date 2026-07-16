export interface NewsItem {
  id: string;
  title: Record<string, string>;
  date: string;
  image: string;
  summary: Record<string, string>;
  content: Record<string, string>;
}

export const newsItems: NewsItem[] = [
  {
    id: 'the-mechanics-and-significance-of-hydraulic-systems',
    title: {
      en: 'The Mechanics and Significance of Hydraulic Systems',
      zh: '液压系统的工作原理与重要性',
    },
    date: '2025-08-22',
    image: '/images/ns211476132-the_mechanics_and_significance_of_hydraulic_systems.jpg',
    summary: {
      en: 'Hydraulic systems form the backbone of countless industrial and mobile applications, enabling powerful and precise movement in machinery across sectors such as construction, manufacturing, aviation, and logistics.',
      zh: '液压系统构成了无数工业和移动应用的支柱，在建筑、制造、航空和物流等领域实现强大而精确的机械运动。',
    },
    content: {
      en: 'Hydraulic systems form the backbone of countless industrial and mobile applications...',
      zh: '液压系统构成了无数工业和移动应用的支柱...',
    },
  },
  {
    id: 'maintaining-your-electric-tow-tractor',
    title: {
      en: 'A Complete Guide to Maintaining Your Electric Tow Tractor',
      zh: '电动牵引车维护完整指南',
    },
    date: '2025-08-22',
    image: '/images/ns211476624-a_complete_guide_to_maintaining_your_electric_tow_tractor.jpg',
    summary: {
      en: 'Keeping your electric tow tractor in peak condition is the key to maximizing productivity, ensuring operator safety, and protecting your investment.',
      zh: '保持电动牵引车处于最佳状态是最大化生产力、确保操作员安全和保护投资的关键。',
    },
    content: {
      en: 'Keeping your electric tow tractor in peak condition...',
      zh: '保持电动牵引车处于最佳状态...',
    },
  },
  {
    id: 'beginners-guide-to-hydraulic-systems',
    title: {
      en: "Beginner's Guide to Hydraulic Systems: Key Concepts and Industrial Applications",
      zh: '液压系统初学者指南：关键概念和工业应用',
    },
    date: '2025-06-25',
    image: '/images/ns211476477-beginner_s_guide_to_hydraulic_systems_key_concepts_and_industrial_applications.jpg',
    summary: {
      en: 'Hydraulic systems are essential to the operation of heavy machinery and industrial equipment, offering unmatched power, precision, and reliability across a wide range of applications.',
      zh: '液压系统对重型机械和工业设备的运行至关重要，在广泛应用中提供无与伦比的动力、精度和可靠性。',
    },
    content: {
      en: 'Hydraulic systems are essential to the operation of heavy machinery...',
      zh: '液压系统对重型机械的运行至关重要...',
    },
  },
];
