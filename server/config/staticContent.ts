export const exchangeRates = [
  { currency: "USD/JOD", buy: 0.7085, sell: 0.7095, change: 0.0 },
  { currency: "USD/ILS", buy: 3.625, sell: 3.655, change: 0.24 },
  { currency: "EUR/ILS", buy: 3.921, sell: 3.978, change: -0.15 },
  { currency: "JOD/ILS", buy: 5.115, sell: 5.16, change: 0.08 },
  { currency: "EUR/USD", buy: 1.082, sell: 1.089, change: -0.05 },
];

export const aboutContent = {
  history: {
    ar: "تأسس بنك فلسطين عام 1960 كأول بنك وطني فلسطيني يسعى لتقديم خدمات مصرفية رائدة تنهض بالاقتصاد المحلي وتمكن شعبنا العظيم من بناء مستقبله بأمان تام.",
    en: "Established in 1960, Bank of Palestine is the first national banking pillar, serving generations and actively growing local economies with pride.",
  },
  governance: {
    ar: "نلتزم بأعلى معايير الإدارة والمراقبة والشفافية وحماية المودعين، متبعين توجيهات سلطة النقد الفلسطينية والمعايير المصرفية الدولية بازل.",
    en: "Governed under maximum global standards, we preserve customer trust with strong risk mitigations, full compliance, and solid values.",
  },
  sustainability: {
    ar: "نخصص سنوياً ما يعادل 5% من أرباحنا الصافية لدعم برامج الاستدامة، التعليم، تمكين المرأة، الرعاية الصحية، والمبادرات الشبابية في ربوع الوطن.",
    en: "We dedicate 5% of net yearly profits to community support, women empowerment, ecological sustainability, and youth scholarships.",
  },
};

export const localeStrings = {
  ar: {
    bankName: "بنك فلسطين",
    tagline: "بنك الكل - خدمات مصرفية ذكية برؤية فلسطينية أصيلة",
    login: "دخول آمن",
    home: "الرئيسية",
    accounts: "الحسابات",
    loans: "القروض والتمويل",
    cards: "البطاقات",
    electronic: "الخدمات الإلكترونية",
    transfers: "الحوالات والصرف",
  },
  en: {
    bankName: "Bank of Palestine",
    tagline: "Bank for Everyone - Smart Financial Ecosystems built with local warmth",
    login: "Secure Login",
    home: "Home",
    accounts: "Accounts",
    loans: "Loans & Finance",
    cards: "Cards",
    electronic: "E-Services",
    transfers: "Remittances",
  },
};

export const localTransfer = {
  id: "local",
  title: { ar: "التحويل المحلي الفوري", en: "Local Instant Wire" },
  tagline: { ar: "تحويل فوري فائق الأمان ومجاني", en: "Instant local wires with zero fees" },
  desc: {
    ar: "أرسل واستقبل الأموال محلياً وبشكل فوري لأي بنك عامل في فلسطين دون عمولات إضافية.",
    en: "Wire cash instantly across Palestine over the unified central remittance grid.",
  },
  bullets: {
    ar: ["منفذ بالكامل في أقل من 10 ثوانٍ", "بدون أي رسوم تذكر لكافة العملاء", "متوفر على مدار الساعة طيلة أيام الأسبوع"],
    en: ["Settled inside 10 seconds flat", "Completely free of charge for retail profiles", "Accessible 24/7/365 through 'Banki' system"],
  },
};
